import { NextRequest, NextResponse } from "next/server";
import { getCoordinationServiceUrl } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const res = await fetch(`${getCoordinationServiceUrl()}/api/care-assignments/${id}/`, { method: "DELETE" });
    if (!res.ok) return NextResponse.json({ error: "Suppression impossible." }, { status: res.status });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Service de coordination indisponible." }, { status: 502 });
  }
}
