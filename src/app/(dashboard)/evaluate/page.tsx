import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { EvaluateClient } from "./evaluate-client";

export default async function EvaluatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const brands = await prisma.brand.findMany({
    where: { userId: session.user.id, onboardingCompleted: true },
    select: { id: true, name: true },
  });

  const recentEvaluations = await prisma.evaluation.findMany({
    where: { brand: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { brand: { select: { name: true } } },
  });

  return (
    <div>
      <Header
        title="Design Evaluation"
        subtitle="AI-powered brand consistency analysis"
      />
      <EvaluateClient
          brands={brands}
          recentEvaluations={recentEvaluations.map((e) => ({
            ...e,
            createdAt: e.createdAt.toISOString(),
          }))}
        />
    </div>
  );
}
