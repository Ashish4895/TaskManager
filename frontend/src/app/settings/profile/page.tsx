"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileSettingsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SettingsLayout>
      <h1 className="text-3xl font-semibold">Profile</h1>

      <div className="mt-8 max-w-3xl rounded-xl border border-border">
        <Row label="Profile picture">
          <Avatar initials={user.fullName.slice(0, 2)} />
        </Row>
        <Row label="Email">
          <span className="flex items-center gap-2 text-sm">
            {user.email}
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
        </Row>
        <Row label="Full name">
          <Input defaultValue={user.fullName} className="max-w-xs" />
        </Row>
        <Row
          label="Title"
          hint="Your job title or role"
        >
          <Input defaultValue="Designer" className="max-w-xs" />
        </Row>
        <Row
          label="Username"
          hint="One word, like a nickname or first name"
        >
          <Input defaultValue="Dexuser" className="max-w-xs" />
        </Row>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Workspace access</h2>
      <div className="mt-4 max-w-3xl rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm">Remove yourself from the workspace</p>
          <Button
            variant="destructive"
            size="sm"
            disabled={leaving}
            onClick={async () => {
              if (!window.confirm("Leave this workspace and sign out?")) return;
              setLeaving(true);
              try {
                await logout();
                router.replace("/login");
              } finally {
                setLeaving(false);
              }
            }}
          >
            {leaving ? "Leaving…" : "Leave Workspace"}
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
