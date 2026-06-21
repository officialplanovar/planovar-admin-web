"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (submitting) return;
    setError(null);
    if (!email || !password) {
      setError("Enter your email and password");
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen font-[Urbanist,sans-serif]">

      {/* ── Left — form panel ─────────────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center px-10 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 0% 0%, rgba(145,120,255,0.18) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 50% at 100% 100%, rgba(145,120,255,0.10) 0%, transparent 60%), " +
            "#FFFFFF",
        }}
      >
        <div className="w-full max-w-[600px] py-24">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.svg"
              alt="Planovar"
              width={68}
              height={68}
              priority
            />
          </div>

          {/* Heading */}
          <h1
            className="text-center font-bold mb-2"
            style={{ fontSize: 28, color: "#0F172A" }}
          >
            Welcome Back
          </h1>
          <p
            className="text-center mb-8"
            style={{ fontSize: 14, color: "#6B7280" }}
          >
            Enter your details to access your account
          </p>

          {/* Google button */}
          {/* <button
            className="btn-glossy w-full flex items-center justify-center gap-3 rounded-full font-semibold mb-6"
            style={{
              height: 50,
              background: "#FFFFFF",
              border: "1.5px solid #E5E7EB",
              color: "#0F172A",
              fontSize: 14,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          > */}
            {/* Google "G" */}
            {/* <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </button> */}

          {/* Divider */}
          {/* <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
          </div> */}

          {/* Email */}
          <div className="mb-4">
            <label
              className="block font-semibold mb-1.5"
              style={{ fontSize: 14, color: "#0F172A" }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email address"
              style={{
                width: "100%",
                height: 52,
                padding: "0 16px",
                borderRadius: 12,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                color: "#0F172A",
                outline: "none",
                background: "#FAFAFA",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5B50F0")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              className="block font-semibold mb-1.5"
              style={{ fontSize: 14, color: "#0F172A" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  height: 52,
                  padding: "0 48px 0 16px",
                  borderRadius: 12,
                  border: "1.5px solid #E5E7EB",
                  fontSize: 14,
                  color: "#0F172A",
                  outline: "none",
                  background: "#FAFAFA",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#5B50F0")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "#9CA3AF", lineHeight: 0, }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zm7.53 7.53l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between mb-38">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              {/* Custom purple checkbox */}
              <div
                onClick={() => setRemember(!remember)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: `2px solid ${remember ? "#5B50F0" : "#D1D5DB"}`,
                  background: remember ? "#5B50F0" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  flexShrink: 0,
                }}
              >
                {remember && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 14, color: "#6B7280" }}>Remember Me</span>
            </label>
            <a
              href="/forgot-password"
              style={{ fontSize: 14, color: "#5B50F0", fontWeight: 600, textDecoration: "none" }}
            >
              Forgot Password
            </a>
          </div>

          {/* Error message */}
          {error && (
            <p
              className="mb-3 text-center"
              style={{ fontSize: 13, color: "#DC2626", fontWeight: 600 }}
            >
              {error}
            </p>
          )}

          {/* Sign in button */}
          <button
            onClick={handleLogin}
            disabled={submitting}
            className="btn-glossy w-full font-bold py-12 m-12"
            style={{
              height: 50,
              borderRadius: 12,
              background: "linear-gradient(135deg, #7B6BFF 0%, #5B50F0 55%, #4A3FE5 100%)",
              color: "#fff",
              fontSize: 15,
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
              boxShadow: "0 4px 20px rgba(91,80,240,0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
            }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>

      {/* ── Right — purple gradient panel ────────────────────────────── */}
      <div
        className="flex-1 relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #7B6BFF 0%, #5B50F0 40%, #3A30D4 100%)",
        }}
      >
        {/* Large decorative circles */}
        <div
          className="absolute -top-16 -right-16 rounded-full"
          style={{ width: 260, height: 260, background: "rgba(255,255,255,0.10)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 rounded-full"
          style={{ width: 220, height: 220, background: "rgba(255,255,255,0.08)" }}
        />

        {/* Sparkle stars */}
        {[
          { top: "7%", right: "9%", size: 36 },
          { bottom: "9%", left: "8%", size: 28 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{ top: s.top, right: s.right, bottom: s.bottom, left: s.left }}
          >
            <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="white" opacity={0.95}>
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
            </svg>
          </div>
        ))}

        {/* Dashboard mockup card */}
        <div
          className="relative z-10"
          style={{
            width: 380,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Image
            src="/login-mockup.png"
            alt="Planovar Admin Dashboard"
            width={760}
            height={500}
            priority
            className="w-full h-auto"
            style={{ display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
