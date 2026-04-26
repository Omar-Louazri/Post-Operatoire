import { NextResponse } from "next/server";

import { getComplicationServiceUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, unknown>;

  try {
    const response = await fetch(
      `${getComplicationServiceUrl()}/api/alerts/evaluate/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const data = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            typeof data.detail === "string"
              ? data.detail
              : "Le service d'alertes n'a pas pu traiter la demande.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        error:
          "Impossible de joindre le microservice de complication-alert-service.",
      },
      { status: 502 },
    );
  }
}
