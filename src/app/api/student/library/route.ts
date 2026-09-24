import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await req.json();
    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const book = await db.libraryBook.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.availableCopies <= 0) {
      return NextResponse.json({ error: "Book is currently out of stock" }, { status: 400 });
    }

    // Process borrow (decrement copy, insert loan)
    await db.$transaction([
      db.libraryBook.update({
        where: { id: bookId },
        data: { availableCopies: book.availableCopies - 1 },
      }),
      db.libraryLoan.create({
        data: {
          bookId,
          studentId: user.id,
          returnBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days loan
          status: "issued",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Reserved "${book.title}". Please pick it up from the college library catalog desk.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Reservation failed" }, { status: 500 });
  }
}
