import { NextRequest, NextResponse } from "next/server";
import { getRecoveryServiceUrl } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;
    const res = await fetch(`${getRecoveryServiceUrl()}/api/recovery-plans/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json() as Record<string, unknown>;
    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Impossible de contacter le service de plans de récupération." },
      { status: 502 },
    );
  }
}
