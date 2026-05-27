import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { href, slug, label } = body ?? {};

    if (typeof href !== "string" || !/^https?:\/\//.test(href)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    console.log(
      JSON.stringify({
        event: "affiliate_click",
        href,
        slug: slug ?? null,
        label: label ?? null,
        ts: new Date().toISOString(),
        ua: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
      }),
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
