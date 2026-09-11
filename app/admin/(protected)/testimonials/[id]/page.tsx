import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const metadata = {
  title: "Edit Testimonial",
};

export default async function EditTestimonialPage({ params }: PageProps<"/admin/testimonials/[id]">) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });

  if (!testimonial) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">Edit testimonial</h1>
      <div className="mt-6">
        <TestimonialForm testimonial={testimonial} />
      </div>
    </div>
  );
}
