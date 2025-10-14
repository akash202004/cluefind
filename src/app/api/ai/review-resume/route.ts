import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resume = (body?.resume || "").toString();
    if (!resume.trim()) {
      return NextResponse.json({ error: "Resume content required" }, { status: 400 });
    }

    const review = await aiService.generateResumeReview(resume);
    return NextResponse.json({ review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate review" }, { status: 500 });
  }
}


