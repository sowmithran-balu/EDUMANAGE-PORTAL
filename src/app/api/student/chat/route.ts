import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// Fallback rule-based diagnostic bot if no GEMINI_API_KEY is present
function fallbackResponse(studentName: string, query: string, data: any) {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes("attendance")) {
    return `Hi ${studentName}, your overall attendance stands at **${data.attendanceRate}%**. ${
      data.attendanceRate < 85 
        ? "This is below our target baseline. Try to attend review sessions to help boost it."
        : "Excellent job maintaining consistent attendance!"
    }`;
  }
  
  if (lowercaseQuery.includes("risk") || lowercaseQuery.includes("failing") || lowercaseQuery.includes("status")) {
    return `Your academic risk level is currently flagged as **${data.riskLevel} (${data.riskScore}/100)**. ${
      data.riskScore >= 60
        ? "This is primarily driven by recent assignment alerts and attendance factors. Let's schedule a review block."
        : data.riskScore >= 30
        ? "You are in stable standing, but keep monitoring homework deadlines to stay on track."
        : "You are doing exceptionally well! Keep maintaining this standard."
    }`;
  }

  if (lowercaseQuery.includes("weak") || lowercaseQuery.includes("subject") || lowercaseQuery.includes("algebra") || lowercaseQuery.includes("physics")) {
    const list = data.riskFactors.length > 0 ? data.riskFactors.join(", ") : "None";
    return `Based on our AI analytics, your weak/focus areas are identified as: **${list}**. We suggest reviewing materials for these topics first.`;
  }

  if (lowercaseQuery.includes("study") || lowercaseQuery.includes("plan") || lowercaseQuery.includes("recommend")) {
    return `Here is a custom recommendation: **${data.recommendations}**`;
  }

  return `Hello ${studentName}! I am your scoped Academic Coach. I only have access to your personal class records. Ask me specific questions like:
  
- *"How is my attendance?"*
- *"Am I at risk of failing?"*
- *"What are my weak areas?"*
- *"Give me a study tip."*`;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Gather all student records for context grounding
    const studentId = user.id;
    const attendance = await db.attendance.findMany({ where: { studentId } });
    const submissions = await db.submission.findMany({
      where: { studentId },
      include: { assignment: true },
    });
    const insights = await db.aIInsight.findMany({
      where: { studentId },
      orderBy: { generatedAt: "desc" },
    });

    const totalAtt = attendance.length;
    const presentCount = attendance.filter((a) => a.status === "present").length;
    const lateCount = attendance.filter((a) => a.status === "late").length;
    const attendanceRate = totalAtt > 0 ? Math.round(((presentCount + 0.5 * lateCount) / totalAtt) * 100) : 100;

    const riskInsight = insights.find((i) => i.type === "risk");
    const recInsight = insights.find((i) => i.type === "recommendation");

    let riskScore = 0;
    let riskLevel = "Low";
    let riskFactors: string[] = [];
    if (riskInsight) {
      try {
        const payload = JSON.parse(riskInsight.payloadJson);
        riskScore = payload.score ?? 0;
        riskLevel = payload.level ?? "Low";
        riskFactors = payload.factors ?? [];
      } catch {}
    }

    let recommendations = "No study plans computed yet. Complete more homework tasks first.";
    if (recInsight) {
      try {
        const payload = JSON.parse(recInsight.payloadJson);
        recommendations = payload.recommendations || recommendations;
      } catch {}
    }

    const recentGrades = submissions.map((sub) => ({
      title: sub.assignment.title,
      score: sub.score ?? 0,
      max: sub.assignment.maxScore,
    }));

    const studentContext = {
      name: user.name,
      attendanceRate,
      riskScore,
      riskLevel,
      riskFactors,
      recommendations,
      recentGrades,
    };

    // 2. Query Gemini if API Key is configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are a scoped academic coach for student ${user.name}.
You are forbidden from answering general questions or acting as a generic assistant.
You can ONLY answer questions related to the student's performance, grades, risk index, and study recommendations.
Ground all answers in the following JSON context:
${JSON.stringify(studentContext, null, 2)}

Provide helpful, short (1-3 sentences), encouraging feedback. If they ask about unrelated items, refuse politely.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: systemPrompt },
                    { text: `Student query: ${message}` }
                  ]
                }
              ]
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const replyText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({ reply: replyText.trim() });
          }
        }
      } catch {}
    }

    // 3. Fallback response if API fails or is not configured
    const fallbackText = fallbackResponse(user.name, message, studentContext);
    return NextResponse.json({ reply: fallbackText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
