import type { Metadata } from "next";
import { DiplomasRoute } from "@/features/diplomas/routes/diplomas.route";

export const metadata: Metadata = {
  title: "Diplomas | Elevate Exam App",
  description: "Browse available diplomas and certifications",
};

interface HomePageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search;

  return <DiplomasRoute search={search} />;
}
