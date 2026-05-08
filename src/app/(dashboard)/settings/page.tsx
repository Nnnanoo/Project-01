import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      brands: {
        select: { id: true, name: true, industry: true, createdAt: true },
      },
    },
  });

  return (
    <div>
      <Header title="Settings" subtitle="Manage your account and brands" />
      <SettingsClient user={user} />
    </div>
  );
}
