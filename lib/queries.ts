import { prisma } from "@/lib/prisma";

export function getCountries() {
  return prisma.country.findMany({ orderBy: { name: "asc" } });
}

export function getCorridor(originCountryId: string, destinationCountryId: string) {
  return prisma.corridor.findUnique({
    where: {
      originCountryId_destinationCountryId: {
        originCountryId,
        destinationCountryId,
      },
    },
    include: {
      originCountry: true,
      destinationCountry: true,
      documents: {
        include: { requiredDocument: true },
      },
    },
  });
}

export function getPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}

export function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });
}

export function getTestimonials(featuredOnly = false) {
  return prisma.testimonial.findMany({
    where: featuredOnly ? { featured: true } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export function getApplicationByToken(token: string) {
  return prisma.application.findUnique({
    where: { accessToken: token },
    include: {
      customer: true,
      originCountry: true,
      destinationCountry: true,
      corridor: true,
      documents: {
        include: { requiredDocument: true },
        orderBy: { createdAt: "asc" },
      },
      progressEvents: {
        orderBy: { createdAt: "desc" },
        include: { createdByAdmin: { select: { name: true } } },
      },
    },
  });
}
