"use client";

import { useState } from "react";
import { BookOpen, Search, Bookmark, Calendar, ArrowRightLeft } from "lucide-react";

interface BookData {
  id: string;
  title: string;
  author: string;
  copies: number;
  availableCopies: number;
}

interface LoanData {
  id: string;
  bookId: string;
  issuedAt: Date;
  returnBy: Date;
  status: string;
  book: BookData;
}

interface LibraryProps {
  books: BookData[];
  initialLoans: LoanData[];
}

export default function StudentLibraryWorkspace({ books, initialLoans }: LibraryProps) {
  const [loans, setLoans] = useState<LoanData[]>(initialLoans);
  const [catalog, setCatalog] = useState<BookData[]>(books);
  const [searchQuery, setSearchQuery] = useState("");
  const [reservingId, setReservingId] = useState<string | null>(null);

  const filteredBooks = catalog.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReserve = async (book: BookData) => {
    setReservingId(book.id);
    try {
      const res = await fetch("/api/student/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`❌ Error reserving book: ${data.error}`);
        return;
      }

      alert(`📚 Textbook Reserved!\n"${book.title}" is ready for collection.`);
      
      // Update catalog copies count
      setCatalog((prev) =>
        prev.map((b) =>
          b.id === book.id ? { ...b, availableCopies: b.availableCopies - 1 } : b
        )
      );

      // Add to loans state
      setLoans((prev) => [
        {
          id: Math.random().toString(),
          bookId: book.id,
          issuedAt: new Date(),
          returnBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: "issued",
          book,
        },
        ...prev,
      ]);
    } catch {
      alert("Book reservation transaction failed.");
    } finally {
      setReservingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Book Search & Catalog (Col-span 2) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-900">
          {/* Search bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>Textbook Catalog</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-1">Search, locate, and request reservations on course materials.</p>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input rounded-xl pl-9 py-2 text-xs"
              />
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <p className="text-slate-500 text-xs py-4 text-center">No textbooks match search criteria.</p>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredBooks.map((book) => (
                <div key={book.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{book.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Author: {book.author}</p>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider mt-2 border ${
                      book.availableCopies > 0
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {book.availableCopies} / {book.copies} Available
                    </span>
                  </div>

                  <button
                    onClick={() => handleReserve(book)}
                    disabled={book.availableCopies <= 0 || reservingId === book.id}
                    className={`font-bold text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                      book.availableCopies > 0
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/15"
                        : "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                    }`}
                  >
                    {reservingId === book.id ? "Reserving..." : "Reserve Book"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Issued books tracking panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-900">
          <h2 className="text-sm font-bold text-white mb-6 flex items-center space-x-2">
            <Bookmark className="h-4 w-4 text-indigo-400" />
            <span>Borrowed Book Log</span>
          </h2>

          <div className="space-y-4">
            {loans.length === 0 ? (
              <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-900 text-center text-xs text-slate-500">
                No active outstanding textbook loans.
              </div>
            ) : (
              loans.map((loan) => (
                <div key={loan.id} className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-850/60 pb-2 mb-2">
                    <div>
                      <p className="font-bold text-white text-xs line-clamp-1">{loan.book.title}</p>
                      <p className="text-[9px] text-slate-500">By {loan.book.author}</p>
                    </div>
                    <span className="inline-flex px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[8px] font-extrabold uppercase tracking-wider">
                      Issued
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span>Return By:</span>
                    </div>
                    <span className="font-bold text-slate-300">{new Date(loan.returnBy).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
