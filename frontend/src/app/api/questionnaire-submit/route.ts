import { NextResponse } from "next/server";

import { getQuestionnaireServiceUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, unknown>;

  try {
    const response = await fetch(
      `${getQuestionnaireServiceUrl()}/api/submissions/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
              : "Erreur lors de la soumission du questionnaire.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Le service questionnaire est indisponible." },
      { status: 502 },
    );
  }
}
