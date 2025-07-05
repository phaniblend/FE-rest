// E:\projects\NRM\restman\app\chef\page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ChefDashboard from "@/components/chef/dashboard";

export default async function ChefPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { restaurant: true }
  });

  if (!user || user.role !== "CHEF") {
    redirect("/unauthorized");
  }

  const orders = await db.order.findMany({
    where: { 
      restaurantId: user.restaurantId,
      status: { in: ["PENDING", "PREPARING"] }
    },
    include: {
      items: {
        include: {
          menuItem: true
        }
      },
      table: true
    },
    orderBy: { createdAt: 'asc' }
  });

  return <ChefDashboard orders={orders} user={user} />;
}