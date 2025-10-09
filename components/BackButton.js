"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BackButton() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "b") {
        router.push("/dashboard");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  return (
    <Link
      href="/dashboard"
      className="inline-block mb-4 mx-3 mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      ← Back
    </Link>
  );
}
