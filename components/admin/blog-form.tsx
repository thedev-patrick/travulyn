"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveBlogPost, type BlogFormState } from "@/app/admin/(protected)/blog/actions";

const initialState: BlogFormState = { status: "idle" };

export function BlogForm({
  post,
}: {
  post?: {
    id: string;
    title: string;
    excerpt: string;
    contentMarkdown: string;
    published: boolean;
    coverImageUrl: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(saveBlogPost, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      {post && <input type="hidden" name="postId" value={post.id} />}
      <div className="grid gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={post?.title} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contentMarkdown">Content (Markdown)</Label>
        <Textarea
          id="contentMarkdown"
          name="contentMarkdown"
          rows={14}
          className="font-mono text-sm"
          defaultValue={post?.contentMarkdown}
          required
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="coverImage">Cover image (optional)</Label>
        {post?.coverImageUrl && (
          <Image src={post.coverImageUrl} alt="" width={160} height={90} className="rounded-md border object-cover" />
        )}
        <Input id="coverImage" name="coverImage" type="file" accept="image/*" />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={post?.published}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="published">Published</Label>
      </div>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Saving…" : "Save post"}
      </Button>
    </form>
  );
}
