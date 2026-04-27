import { NextRequest, NextResponse } from "next/server";
import { getQuestionnaireServiceUrl } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const res = await fetch(
      `${getQuestionnaireServiceUrl()}/api/questionnaires/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const data = (await res.json()) as Record<string, unknown>;
    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Le service questionnaire est indisponible." },
      { status: 502 },
    );
  }
}
