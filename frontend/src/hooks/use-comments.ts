"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type Comment } from "@/lib/api";

export function useComments(todoId: string | null, enabled: boolean) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled || !todoId) {
      setComments([]);
      return;
    }
    setLoading(true);
    try {
      setComments(await api.getComments(todoId));
    } finally {
      setLoading(false);
    }
  }, [enabled, todoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addComment = async (text: string) => {
    if (!todoId) return;
    const comment = await api.createComment(todoId, { text });
    setComments((prev) => [comment, ...prev]);
    return comment;
  };

  const removeComment = async (id: string) => {
    if (!todoId) return;
    await api.deleteComment(todoId, id);
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  return { comments, loading, refresh, addComment, removeComment };
}
