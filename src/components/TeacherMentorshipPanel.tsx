"use client";

import { useState } from "react";
import { Users, BookOpen, Send, Calendar, MessageSquare } from "lucide-react";

interface MenteeData {
  id: string;
  name: string;
  email: string;
  cgpa: number;
  attendanceRate: number;
}

interface MeetingData {
  id: string;
  menteeId: string;
  menteeName: string;
  date: Date;
  notes: string;
  category: string;
}

interface MentorshipProps {
  mentees: MenteeData[];
  initialMeetings: MeetingData[];
}

export default function TeacherMentorshipPanel({ mentees, initialMeetings }: MentorshipProps) {
  const [meetings, setMeetings] = useState<MeetingData[]>(initialMeetings);
  const [selectedMentee, setSelectedMentee] = useState<MenteeData | null>(null);
  const [category, setCategory] = useState("academic");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentee) return;
    if (!notes.trim()) {
      alert("Please enter advisory meeting details.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/teacher/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menteeId: selectedMentee.id,
          category,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(`📝 Session saved successfully with ${selectedMentee.name}!`);

      setMeetings((prev) => [
        {
          id: data.meeting.id,
          menteeId: selectedMentee.id,
          menteeName: selectedMentee.name,
          date: new Date(),
          notes,
          category,
        },
        ...prev,
      ]);
      setNotes("");
      setSelectedMentee(null);
    } catch {
      alert("Transaction error recording advisory session.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-900 space-y-6">
      <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-4">
        <Users className="h-4 w-4 text-amber-500" />
        <span>Academic Advising & Mentoring</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Mentee List */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned Mentees</h3>
          <div className="space-y-2">
            {mentees.map((mentee) => (
              <div key={mentee.id} className="p-4 bg-slate-950/40 rounded-2xl border border-slate-900 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{mentee.name}</h4>
                  <p className="text-[9px] text-slate-500">{mentee.email}</p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-[9px] text-slate-400 font-semibold">
                    <span>CGPA: {mentee.cgpa}</span>
                    <span>Attendance: {mentee.attendanceRate}%</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMentee(mentee)}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-lg cursor-pointer transition-all shadow-md shadow-amber-600/10"
                >
                  Log Session
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting Logger / History Panel */}
        <div className="space-y-4">
          {selectedMentee ? (
            <div className="p-4 bg-slate-950/40 rounded-2xl border border-amber-500/25 space-y-4 text-xs">
              <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Log Session: {selectedMentee.name}</h3>
              
              <form onSubmit={handleSaveNote} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Meeting Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full glass-input rounded-xl py-2 px-3 focus:outline-none"
                  >
                    <option value="academic">Academic Counseling</option>
                    <option value="attendance">Attendance Outreaches</option>
                    <option value="career">Career advising</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Meeting Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter details of counseling discussion..."
                    className="w-full h-24 glass-input rounded-xl p-3 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-600/50 text-white font-bold text-[9px] uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
                  >
                    <Send className="h-3 w-3" />
                    <span>{submitting ? "Saving..." : "Save Session"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMentee(null)}
                    className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-[9px] uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Counseling Log History</h3>
              {meetings.length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">No meeting sessions logged yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="p-3 bg-slate-950/20 rounded-xl border border-slate-900 text-[10px] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300">{meeting.menteeName}</span>
                        <span className="inline-flex px-1 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 capitalize">
                          {meeting.category}
                        </span>
                      </div>
                      <p className="text-slate-400 italic">"{meeting.notes}"</p>
                      <p className="text-[8px] text-slate-600 flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(meeting.date).toLocaleDateString()}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
