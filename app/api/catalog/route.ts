import { NextResponse } from "next/server";
import axios from "axios";

const CATALOG_API_URL =
  process.env.CATALOG_API_URL || "http://ecodrive.pangeanic.com:19193";

export async function GET() {
  try {
    const response = await axios.post(
      `${CATALOG_API_URL}/management/federatedcatalog/request`,
      {
        offset: 0,
        limit: 100,
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching catalog from API:", error);

    return NextResponse.json(
      { error: "Error fetching catalog" },
      { status: 500 },
    );
  }
}
