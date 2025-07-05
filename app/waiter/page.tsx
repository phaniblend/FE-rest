// E:\projects\NRM\restman\app\waiter\page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import WaiterDashboard from "@/components/waiter/dashboard";

export default async function WaiterPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { restaurant: true }
  });

  if (!user || user.role !== "WAITER") {
    redirect("/unauthorized");
  }

  const tables = await db.table.findMany({
    where: { restaurantId: user.restaurantId },
    include: {
      orders: {
        where: {
          status: { in: ["PENDING", "PREPARING", "READY"] }
        },
        include: {
          items: {
            include: {
              menuItem: true
            }
          }
        }
      }
    }
  });

  const menuItems = await db.menuItem.findMany({
    where: { 
      restaurantId: user.restaurantId,
      isAvailable: true
    },
    orderBy: { category: 'asc' }
  });

  return <WaiterDashboard tables={tables} menuItems={menuItems} user={user} />;
}