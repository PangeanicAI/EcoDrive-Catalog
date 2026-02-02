import { NextResponse } from "next/server";
import axios from "axios";

const CATALOG_API_URL =
  process.env.CATALOG_API_URL || "http://ecodrive.pangeanic.com:19195";

export async function GET() {
  try {
    const response = await axios.get(`${CATALOG_API_URL}/federatedcatalog`, {
      timeout: 10000,
      headers: {
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching catalog from API:", error);

    // Retornar error con status code apropiado
    return NextResponse.json(
      { error: "Error fetching catalog" },
      { status: 500 }
    );
  }
}
