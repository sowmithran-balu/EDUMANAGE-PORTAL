import { recomputeStudentInsights } from "./aiEngine";

type EventType = "ACADEMIC_WRITE";

interface EventPayload {
  studentId: string;
  classId?: string;
}

/**
 * Dispatches an asynchronous academic event.
 * Runs the AI recomputation in the background, updating stored AIInsights in the database.
 * This ensures UI writes remain fast and responsive.
 */
export function dispatchEvent(type: EventType, payload: EventPayload) {
  if (type === "ACADEMIC_WRITE") {
    // Run the recompute job asynchronously (in-memory micro-worker)
    // We execute it inside a self-invoking function and do not await it
    (async () => {
      try {
        console.log(`[EventDispatcher] Async recompute triggered for student ${payload.studentId} in class ${payload.classId || "all"}`);
        const result = await recomputeStudentInsights(payload.studentId, payload.classId);
        console.log(`[EventDispatcher] Async recompute completed. Risk score: ${result.risk.score}`);
      } catch (error) {
        console.error(`[EventDispatcher] Error recomputing insights for student ${payload.studentId}:`, error);
      }
    })();
  }
}
