import { NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getCatalogItemById } from "@/lib/server/catalog";

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
const MINIO_BUCKET = process.env.MINIO_BUCKET;

function getMinioClient() {
  if (
    !MINIO_ENDPOINT ||
    !MINIO_ACCESS_KEY ||
    !MINIO_SECRET_KEY ||
    !MINIO_BUCKET
  ) {
    throw new Error("Missing MinIO environment variables");
  }

  const endpoint = new URL(MINIO_ENDPOINT);

  return new S3Client({
    region: "us-east-1",
    endpoint: MINIO_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: MINIO_ACCESS_KEY,
      secretAccessKey: MINIO_SECRET_KEY,
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

    const minioClient = getMinioClient();

    const command = new GetObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: catalogItem.download.objectKey,
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
