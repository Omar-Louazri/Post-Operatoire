import { NextResponse } from "next/server";

import { getComplicationServiceUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${getComplicationServiceUrl()}/api/alerts/${id}/`,
      { cache: "no-store" },
    );
    const data = (await res.json()) as Record<string, unknown>;
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Service indisponible." }, { status: 502 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${getComplicationServiceUrl()}/api/alerts/${id}/`,
      { method: "DELETE", cache: "no-store" },
    );
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    const data = (await res.json()) as Record<string, unknown>;
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Service indisponible." }, { status: 502 });
  }
}
