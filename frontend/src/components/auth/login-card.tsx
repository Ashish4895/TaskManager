"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { PyramidLogo } from "@/components/auth/pyramid-logo";

export function LoginCard({
  loading,
  error,
  onGuest,
  onGoogle,
}: {
  loading: boolean;
  error: string;
  onGuest: () => void;
  onGoogle: () => void;
}) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <PyramidLogo />
        <span className="text-lg font-semibold">Pyramid</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">Let&apos;s get back on track</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your email below to login to your account.
      </p>

      <div className="mt-6 space-y-3">
        <Button className="w-full" size="lg" disabled={loading} onClick={onGuest}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue as Guest"}
        </Button>
        <GoogleLoginButton disabled={loading} onClick={onGoogle} />
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <span className="underline">Terms of Service</span> and{" "}
        <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
}
