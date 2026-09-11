import { TestimonialForm } from "@/components/admin/testimonial-form";

export const metadata = {
  title: "New Testimonial",
};

export default function NewTestimonialPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">New testimonial</h1>
      <div className="mt-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
