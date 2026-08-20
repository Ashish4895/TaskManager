"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LoginCard } from "@/components/auth/login-card";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError } from "@/lib/api";
import { getGoogleLoginUrl } from "@/lib/auth-urls";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { guestLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "google") {
      setError("Google login failed or was cancelled.");
    }
  }, [searchParams]);

  const handleGuest = async () => {
    setLoading(true);
    setError("");
    try {
      await guestLogin();
      router.push("/tasks");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setError("");
    window.location.href = getGoogleLoginUrl();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <LoginCard
        loading={loading}
        error={error}
        onGuest={handleGuest}
        onGoogle={handleGoogle}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
