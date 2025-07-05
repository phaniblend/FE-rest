// E:\projects\NRM\restman\app\manager\page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ManagerDashboard from "@/components/manager/dashboard";

export default async function ManagerPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { restaurant: true }
  });

  if (!user || user.role !== "MANAGER") {
    redirect("/unauthorized");
  }

  return <ManagerDashboard user={user} restaurant={user.restaurant!} />;
}