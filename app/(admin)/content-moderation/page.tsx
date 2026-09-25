"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Content moderation is hidden until a reporting/flagging subsystem exists
// (there's no data to moderate yet). Redirect any direct navigation away.
export default function ContentModerationPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}
