import { NextResponse } from "next/server";
import { GetObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getCatalogItemById } from "@/lib/server/catalog";

type MinioConfig = {
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
};

function getMinioConfig(): MinioConfig {
  const endpoint = process.env.MINIO_ENDPOINT;
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;
  const bucket = process.env.MINIO_BUCKET;

  if (
    !endpoint ||
    !accessKey ||
    !secretKey ||
    !bucket
  ) {
    throw new Error("Missing MinIO environment variables");
  }

  return { endpoint, accessKey, secretKey, bucket };
}

function getMinioClient(config: MinioConfig) {
  const endpoint = new URL(config.endpoint);

  return new S3Client({
    region: "us-east-1",
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey,
    },
    tls: endpoint.protocol === "https:",
  });
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const catalogItem = await getCatalogItemById(params.id);

    if (!catalogItem?.download?.objectKey) {
      return NextResponse.json(
        { error: "This item does not have a downloadable file." },
        { status: 404 },
      );
    }

    const minioConfig = getMinioConfig();
    const minioClient = getMinioClient(minioConfig);
    const objectKey = catalogItem.download.objectKey;

    try {
      await minioClient.send(
        new HeadObjectCommand({
          Bucket: minioConfig.bucket,
          Key: objectKey,
        }),
      );
    } catch (error: any) {
      const errorCode = error?.name || error?.Code;
      if (errorCode === "NotFound" || errorCode === "NoSuchKey") {
        return NextResponse.json(
          {
            error:
              "Download file not found in storage. Please contact support to update this resource.",
          },
          { status: 404 },
        );
      }
      throw error;
    }

    const command = new GetObjectCommand({
      Bucket: minioConfig.bucket,
      Key: objectKey,
      ResponseContentDisposition: `attachment; filename="${catalogItem.download.fileName || `${catalogItem.id}.bin`}"`,
    });

    const signedUrl = await getSignedUrl(minioClient, command, {
      expiresIn: 60 * 5,
    });

    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Error generating MinIO download link:", error);
    return NextResponse.json(
      { error: "Unable to generate download link." },
      { status: 500 },
    );
  }
}
