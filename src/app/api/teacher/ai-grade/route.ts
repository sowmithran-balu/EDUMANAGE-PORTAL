import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId, assignmentId } = await req.json();
    if (!studentId || !assignmentId) {
      return NextResponse.json({ error: "Student ID and Assignment ID are required" }, { status: 400 });
    }

    // 1. Fetch student and assignment details
    const student = await db.user.findUnique({
      where: { id: studentId },
      include: {
        aiInsights: {
          orderBy: { generatedAt: "desc" },
        },
      },
    });

    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!student || !assignment) {
      return NextResponse.json({ error: "Student or Assignment not found" }, { status: 404 });
    }

    const maxScore = assignment.maxScore;
    const studentName = student.name;

    // 2. Determine student risk profiles to ground recommendations
    const riskInsight = student.aiInsights.find((i) => i.type === "risk");
    let riskScore = 0;
    let riskLevel = "Low";
    if (riskInsight) {
      try {
        const payload = JSON.parse(riskInsight.payloadJson);
        riskScore = payload.score ?? 0;
        riskLevel = payload.level ?? "Low";
      } catch {}
    }

    let draftScore = Math.round(maxScore * 0.85);
    let draftFeedback = `Hi ${studentName}, excellent logical progression in this submission. Your equations and proofs are well structured. Keep up this high standard.`;

    if (riskScore >= 60) {
      draftScore = Math.round(maxScore * 0.65);
      draftFeedback = `Hi ${studentName}, you have laid out a solid basic structure, but there are notable gaps in concept application. I recommend attending this week's math workshop reviews and revisiting the online lesson modules.`;
    } else if (riskScore < 30) {
      draftScore = Math.round(maxScore * 0.95);
      draftFeedback = `Hi ${studentName}, this is an outstanding piece of work. The proofs are perfectly optimized and clearly documented. Excellent job!`;
    }

    // 3. Integrate Gemini if configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are a rubric grading co-pilot assistant for teachers.
You are drafting a score out of ${maxScore} and a natural-language feedback paragraph for student ${studentName}'s assignment: "${assignment.title}".
The student is currently flagged as having a ${riskLevel} risk level (${riskScore}/100).
Your goal is to write a helpful, constructive, and realistic feedback paragraph.
Your draft score should be around ${draftScore} out of ${maxScore} depending on their status.
Return your response in exact JSON format:
{
  "score": number,
  "feedback": "string text"
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: systemPrompt }]
                }
              ],
              generationConfig: {
                responseMimeType: "application/json"
              }
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const replyText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            const parsed = JSON.parse(replyText.trim());
            if (typeof parsed.score === "number" && parsed.feedback) {
              return NextResponse.json({
                score: Math.min(parsed.score, maxScore),
                feedback: parsed.feedback,
              });
            }
          }
        }
      } catch {}
    }

    // 4. Return local computed draft as fallback
    return NextResponse.json({
      score: draftScore,
      feedback: draftFeedback,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to draft grade" }, { status: 500 });
  }
}
