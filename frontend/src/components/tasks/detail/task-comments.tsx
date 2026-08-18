"use client";

import { useState } from "react";
import { Loader2, Paperclip, Send, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useComments } from "@/hooks/use-comments";
import { formatRelativeTime } from "@/lib/format-date";

export function TaskComments({
  todoId,
  enabled,
}: {
  todoId: string;
  enabled: boolean;
}) {
  const { comments, loading, addComment, removeComment } = useComments(todoId, enabled);
  const [reply, setReply] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const post = async (text: string, clear: () => void) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    try {
      await addComment(trimmed);
      clear();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-10 border-t border-border pt-6">
      <h3 className="mb-4 text-sm font-semibold">Activity</h3>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
          {comments.map((c) => (
            <div key={c._id} className="group flex gap-3">
              <Avatar initials={c.authorName.slice(0, 2)} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{c.authorName}</span>{" "}
                  <span className="text-muted-foreground">
                    {formatRelativeTime(c.createdAt)}
                  </span>
                </p>
                <p className="mt-1 text-sm">{c.text}</p>
              </div>
              <button
                type="button"
                className="rounded p-1 opacity-0 hover:bg-muted group-hover:opacity-100"
                onClick={() => removeComment(c._id)}
                aria-label="Delete comment"
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <Input
          placeholder="Leave a reply..."
          value={reply}
          disabled={busy}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && post(reply, () => setReply(""))}
        />
        <button type="button" className="rounded-lg p-2 hover:bg-muted" disabled={busy}>
          <Paperclip className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-muted"
          disabled={busy}
          onClick={() => post(reply, () => setReply(""))}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4">
        <Input
          placeholder="Add a comment..."
          value={comment}
          disabled={busy}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && post(comment, () => setComment(""))}
        />
      </div>
    </section>
  );
}
