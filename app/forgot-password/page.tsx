"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center bg-white px-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#5B50F0"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary text-center mb-2">Forgot Password?</h1>
          <p className="text-text-secondary text-center text-sm mb-8">Don&apos;t Worry, we&apos;ll send you a password reset link</p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your Email address"
              className="w-full h-12 px-4 rounded-xl border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          <Link href="/login" className="flex items-center gap-1 text-sm text-primary font-medium mb-8 hover:underline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Back to login
          </Link>
          <button onClick={() => router.push("/confirm-otp")}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors btn-glossy">
            Sign in
          </button>
        </div>
      </div>
      <AuthRightPanel />
    </div>
  );
}

function AuthRightPanel() {
  return (
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
  );
}
