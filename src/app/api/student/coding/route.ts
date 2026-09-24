import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assignmentId, code } = await req.json();
    if (!assignmentId || !code) {
      return NextResponse.json({ error: "Assignment ID and Code are required" }, { status: 400 });
    }

    const assignment = await db.codingAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    let testCases: { input: string; output: string }[] = [];
    try {
      testCases = JSON.parse(assignment.testCasesJson);
    } catch {
      return NextResponse.json({ error: "Invalid test case configuration on assignment" }, { status: 500 });
    }

    let compileOutput = "";
    let passedCount = 0;
    const testResults: any[] = [];

    try {
      // Create user solve function
      // Wrap user code to isolate it inside a local scope evaluation
      const evaluator = new Function(`
        ${code}
        if (typeof solve !== 'function') {
          throw new Error("Function 'solve' is not defined. Ensure you declare: function solve(...)");
        }
        return solve;
      `);

      const solveFn = evaluator();

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        let arg: any;
        
        try {
          // Attempt to parse input if it is JSON array/object, otherwise treat as primitive
          arg = JSON.parse(tc.input);
        } catch {
          // If input is NaN/not JSON, treat as raw number or string
          const num = parseFloat(tc.input);
          arg = isNaN(num) ? tc.input : num;
        }

        const expected = tc.output.trim();
        const userOutputVal = solveFn(arg);
        const userOutput = String(userOutputVal).trim();

        const passed = userOutput === expected;
        if (passed) passedCount++;

        testResults.push({
          testCase: i + 1,
          input: tc.input,
          expected,
          actual: userOutput,
          passed,
        });
      }

      compileOutput = `Compilation success. Passed ${passedCount}/${testCases.length} test cases.`;
    } catch (err: any) {
      compileOutput = `Compilation / Execution Error:\n${err.message}`;
    }

    const status = passedCount === testCases.length ? "passed" : "failed";

    // Write submission to database
    await db.codingSubmission.create({
      data: {
        codingAssignmentId: assignment.id,
        studentId: user.id,
        code,
        status,
        compileOutput,
      },
    });

    return NextResponse.json({
      status,
      compileOutput,
      testResults,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Evaluation failure" }, { status: 500 });
  }
}
