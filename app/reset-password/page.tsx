"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const hasUpper = /[A-Z]/.test(newPw);
  const hasNumber = /\d/.test(newPw);
  const hasSpecial = /[@$%!#^&*]/.test(newPw);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center bg-white px-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 flex items-center justify-center text-5xl">🔒</div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary text-center mb-2">Reset password</h1>
          <p className="text-text-secondary text-center text-sm mb-8">Create a new password you can remember</p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-1.5">New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder="Confirm Password"
                className="w-full h-12 px-4 pr-12 rounded-xl border border-border text-sm focus:outline-none focus:border-primary" />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-hint">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-1.5">Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="Confirm Password"
                className="w-full h-12 px-4 pr-12 rounded-xl border border-border text-sm focus:outline-none focus:border-primary" />
              <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-hint">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              </button>
            </div>
          </div>
          <div className="space-y-2 mb-8">
            {[
              { ok: hasUpper, text: "Should have a Capital Letter" },
              { ok: hasNumber, text: "Should have a Number e.g 1,2,4,etc" },
              { ok: hasSpecial, text: "Should have a Special Character e.g @,$,%,etc" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${r.ok ? "bg-primary" : "bg-gray-200"}`}>
                  {r.ok && <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                </div>
                <span className="text-sm text-text-secondary">{r.text}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { localStorage.setItem("admin_isLoggedIn","true"); router.push("/dashboard"); }}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors btn-glossy">
            Create Password
          </button>
        </div>
      </div>
      <div className="flex-1 relative flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #6B5CF6 0%, #5B50F0 50%, #4A3FE5 100%)" }}>
        {[
          { top: "8%", right: "12%", fontSize: 32 },
          { top: "15%", left: "18%", fontSize: 20 },
          { bottom: "12%", right: "8%", fontSize: 28 },
        ].map((s, i) => (
          <div key={i} className="absolute text-white" style={{ ...s as React.CSSProperties, opacity: 0.9 }}>✦</div>
        ))}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
