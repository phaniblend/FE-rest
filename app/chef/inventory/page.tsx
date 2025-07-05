// E:\projects\NRM\restman\app\chef\inventory\page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ChefInventory from "@/components/chef/inventory";

export default async function ChefInventoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { restaurant: true }
  });

  if (!user || user.role !== "CHEF") {
    redirect("/unauthorized");
  }

  const inventory = await db.inventoryItem.findMany({
    where: { restaurantId: user.restaurantId },
    orderBy: { category: 'asc' }
  });

  return <ChefInventory inventory={inventory} />;
}