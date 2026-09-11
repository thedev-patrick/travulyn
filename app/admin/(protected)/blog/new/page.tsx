import { BlogForm } from "@/components/admin/blog-form";

export const metadata = {
  title: "New Post",
};

export default function NewBlogPostPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">New blog post</h1>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
