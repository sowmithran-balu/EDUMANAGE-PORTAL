"use client";

import { useState } from "react";
import { CreditCard, IndianRupee, AlertCircle, CheckCircle2, Calendar, ShieldCheck, X } from "lucide-react";

interface FeeData {
  id: string;
  type: string;
  amount: number;
  paid: number;
  dueDate: Date;
  status: string;
}

interface FeesProps {
  initialFees: FeeData[];
}

export default function StudentFeesWorkspace({ initialFees }: FeesProps) {
  const [fees, setFees] = useState<FeeData[]>(initialFees);
  const [selectedFee, setSelectedFee] = useState<FeeData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [paying, setPaying] = useState(false);

  // Sum calculations
  const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paid, 0);
  const pendingBalance = totalAmount - totalPaid;

  const handlePayInvoice = async () => {
    if (!selectedFee) return;
    setPaying(true);

    try {
      const res = await fetch("/api/student/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeId: selectedFee.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Success
      alert("💳 ERP Transaction Complete!\nYour invoice balance has been updated.");
      setFees((prev) =>
        prev.map((f) =>
          f.id === selectedFee.id ? { ...f, paid: f.amount, status: "paid" } : f
        )
      );
      setSelectedFee(null);
    } catch {
      alert("Payment transaction failed. Please retry.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notice Alert Banner */}
      <div className="bg-[#FCEEF0] border border-[#6E1E27]/10 p-4 rounded-2xl flex items-center justify-between text-xs text-[#6E1E27]">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-[#6E1E27] shrink-0" />
          <div>
            <span className="font-extrabold uppercase tracking-wider block">ERP Secure Payments Portal</span>
            <p className="opacity-90 font-medium mt-0.5">Please review your active dues ledger. Payments processed update term clearance status immediately.</p>
          </div>
        </div>
      </div>

      {/* ERP Ledger Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Term Invoices</p>
            <p className="text-xl font-black text-slate-900 mt-1">₹{totalAmount.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[#6E1E27]">
            <IndianRupee className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Paid Dues</p>
            <p className="text-xl font-black text-emerald-700 mt-1">₹{totalPaid.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending Balance</p>
            <p className="text-xl font-black text-amber-600 mt-1">₹{pendingBalance.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-[#FCEEF0] rounded-xl border border-[#6E1E27]/10 text-[#6E1E27]">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Dues list ledger */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h2 className="text-sm font-black text-slate-950 mb-6 flex items-center space-x-2 uppercase tracking-wide">
          <CreditCard className="h-4.5 w-4.5 text-[#6E1E27]" />
          <span>Active Dues Registry</span>
        </h2>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-slate-650">
            <thead>
              <tr className="border-b border-slate-200 text-[9px] uppercase tracking-widest text-slate-500">
                <th className="pb-3 pr-4 font-bold">Category</th>
                <th className="pb-3 px-4 font-bold">Amount</th>
                <th className="pb-3 px-4 font-bold">Paid</th>
                <th className="pb-3 px-4 font-bold">Due Date</th>
                <th className="pb-3 px-4 font-bold text-center">Status</th>
                <th className="pb-3 pl-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50/50">
                  <td className="py-4 pr-4 font-extrabold text-slate-900 capitalize">
                    {fee.type} Fee
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    ₹{fee.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-600">
                    ₹{fee.paid.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-500">
                    {new Date(fee.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                      fee.status === "paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-[#FCEEF0] text-[#6E1E27] border-[#6E1E27]/10"
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    {fee.status === "pending" ? (
                      <button
                        onClick={() => setSelectedFee(fee)}
                        className="bg-[#6E1E27] hover:bg-[#5A171F] text-white font-black text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-lg cursor-pointer transition-all shadow-md shadow-[#6E1E27]/10"
                      >
                        Pay Invoice
                      </button>
                    ) : (
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">No Dues</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Screen Modal */}
      {selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden flex flex-col space-y-6 shadow-2xl">
            <button
              onClick={() => setSelectedFee(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="inline-flex items-center space-x-1.5 bg-[#FCEEF0] border border-[#6E1E27]/10 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest text-[#6E1E27] uppercase mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>ERP Secured Gateway</span>
              </div>
              <h3 className="text-sm font-black text-slate-950 uppercase">Payment Details</h3>
              <p className="text-[10px] text-slate-550 font-medium">Processing dues for <strong className="text-slate-800 capitalize">{selectedFee.type}</strong></p>
            </div>

            <div className="p-4 bg-[#F7F7F9] rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
              <span className="font-bold">Total Dues Pay Amount:</span>
              <span className="text-base font-black text-[#6E1E27]">₹{selectedFee.amount.toLocaleString()}</span>
            </div>

            <div className="space-y-3">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Select Payment Method</p>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-black uppercase">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`py-3 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === "upi"
                      ? "bg-[#FCEEF0] border-[#6E1E27] text-[#6E1E27]"
                      : "bg-[#F7F7F9] border-slate-200 text-slate-500"
                  }`}
                >
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`py-3 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "bg-[#FCEEF0] border-[#6E1E27] text-[#6E1E27]"
                      : "bg-[#F7F7F9] border-slate-200 text-slate-500"
                  }`}
                >
                  Credit Card
                </button>
                <button
                  onClick={() => setPaymentMethod("net")}
                  className={`py-3 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === "net"
                      ? "bg-[#FCEEF0] border-[#6E1E27] text-[#6E1E27]"
                      : "bg-[#F7F7F9] border-slate-200 text-slate-500"
                  }`}
                >
                  Net Banking
                </button>
              </div>
            </div>

            <button
              onClick={handlePayInvoice}
              disabled={paying}
              className="w-full bg-[#6E1E27] hover:bg-[#5A171F] disabled:bg-[#6E1E27]/55 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#6E1E27]/10"
            >
              {paying ? "Processing Transaction..." : "Process Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
