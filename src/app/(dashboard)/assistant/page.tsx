import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { AssistantClient } from "./assistant-client";

export default async function AssistantPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const brands = await prisma.brand.findMany({
    where: { userId: session.user.id, onboardingCompleted: true },
    select: { id: true, name: true },
  });

  const recentSessions = await prisma.chatSession.findMany({
    where: { brand: { userId: session.user.id } },
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      <Header
        title="Brand Assistant"
        subtitle="AI trained on your brand guidelines"
      />
      <AssistantClient brands={brands} recentSessions={recentSessions} />
    </div>
  );
}
