"use client";

import { useState } from "react";
import { Mail, Phone, Clock, Send, MessageSquare, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const faqs = [
    { q: "How does the AI academic-intelligence engine work?", a: "The AI Engine aggregates learning events (attendance rates, assignment scores, and exam trajectories) in real-time. It processes these data streams using weighted regression models to identify weak concepts and predict performance decay." },
    { q: "Is my academic data secure?", a: "Absolutely. All records are securely hashed, and PII metrics are omitted from AI engine analytical logs. Students have ownership over their exports." },
    { q: "How can I request class enrollment overrides?", a: "You can reach out directly via this support panel. State your target course ID and section cohort in the ticket description." },
    { q: "What should teachers do when AI flags a student as high-risk?", a: "Teachers receive details about the top 3 risk contribution factors (e.g. attendance dips or missed homework) directly on their grading panels, along with actionable review session recommendations." },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulated rate limiting based on submission timestamps stored in local storage
    const lastSubmit = localStorage.getItem("last_support_submit");
    const now = Date.now();
    
    if (lastSubmit && now - parseInt(lastSubmit) < 60000) {
      setError("Rate Limit Exceeded. Please wait 60 seconds before sending another ticket.");
      setLoading(false);
      return;
    }

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 8000));
    
    localStorage.setItem("last_support_submit", now.toString());
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      {/* Contact info & FAQs */}
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Contact Support
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Have questions about your AI Insights, enrollment routes, or portal access? Reach out to our technical support team.
          </p>
        </div>

        {/* Support channels */}
        <div className="space-y-5 text-sm text-slate-300">
          <div className="flex items-center space-x-3.5 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <Mail className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="font-bold text-white">Email Hotline</p>
              <p className="text-xs text-slate-400 mt-0.5">support@aetheracademy.edu</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <Phone className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="font-bold text-white">Direct Line</p>
              <p className="text-xs text-slate-400 mt-0.5">+1 (555) 732-3843</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <Clock className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="font-bold text-white">Service Hours</p>
              <p className="text-xs text-slate-400 mt-0.5">Mon - Fri, 9:00 AM - 5:00 PM EST</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-200">{faq.q}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket form */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800/80">
        <h2 className="text-lg font-bold text-white mb-4">Open Support Ticket</h2>
        <p className="text-xs text-slate-400 mb-6 leading-normal">
          Submissions are rate-limited to 1 request per minute to prevent support spam.
        </p>

        {success ? (
          <div className="p-8 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-center space-y-3">
            <h3 className="font-bold text-emerald-400">Ticket Submitted Successfully</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Your support request has been logged. An academic administrator will reply via email shortly.
            </p>
            <button
              onClick={() => { setSuccess(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all uppercase tracking-wider mt-4 cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="name" className="font-semibold text-slate-300">Name</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium"
                placeholder="Alex Mercer"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="font-semibold text-slate-300">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium"
                placeholder="alex@school.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="font-semibold text-slate-300">Subject</label>
              <input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium"
                placeholder="Class override request"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="font-semibold text-slate-300">Message Details</label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full glass-input rounded-xl py-3 px-4 text-xs font-medium leading-relaxed resize-none"
                placeholder="State your cohort details or query here..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold py-3.5 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
            >
              {loading ? (
                <span>Dispatching Ticket...</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
