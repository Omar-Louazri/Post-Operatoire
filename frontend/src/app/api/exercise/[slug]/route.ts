import { NextRequest, NextResponse } from "next/server";
import { getExerciseServiceUrl } from "@/lib/api";

type Context = { params: Promise<{ slug: string }> };

export async function PATCH(req: NextRequest, { params }: Context) {
  const { slug } = await params;
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const res = await fetch(`${getExerciseServiceUrl()}/api/exercises/${slug}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as Record<string, unknown>;
    if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Le service exercices est indisponible." }, { status: 502 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const { slug } = await params;
  try {
    const res = await fetch(`${getExerciseServiceUrl()}/api/exercises/${slug}/`, { method: "DELETE" });
    if (!res.ok) return NextResponse.json({ error: "Suppression impossible." }, { status: res.status });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Le service exercices est indisponible." }, { status: 502 });
  }
}
