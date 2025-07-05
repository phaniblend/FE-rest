// E:\projects\NRM\restman\app\dashboard\layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart,
  ChefHat,
  Utensils,
  ClipboardList
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { restaurant: true }
  });

  if (!user || !user.restaurant) {
    redirect("/onboarding");
  }

  // Role-based navigation
  const navigation = {
    OWNER: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Menu", href: "/dashboard/menu", icon: Utensils },
      { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
      { name: "Inventory", href: "/dashboard/inventory", icon: Package },
      { name: "Staff", href: "/dashboard/staff", icon: Users },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    ],
    MANAGER: [
      { name: "Dashboard", href: "/manager", icon: Home },
      { name: "Inventory", href: "/manager/inventory", icon: Package },
      { name: "Orders", href: "/manager/orders", icon: ShoppingCart },
      { name: "Staff", href: "/manager/staff", icon: Users },
      { name: "Reports", href: "/manager/reports", icon: BarChart },
    ],
    CHEF: [
      { name: "Dashboard", href: "/chef", icon: Home },
      { name: "Orders", href: "/chef/orders", icon: ClipboardList },
      { name: "Inventory", href: "/chef/inventory", icon: Package },
      { name: "Recipes", href: "/chef/recipes", icon: ChefHat },
    ],
    WAITER: [
      { name: "Dashboard", href: "/waiter", icon: Home },
      { name: "Tables", href: "/waiter/tables", icon: Utensils },
      { name: "Orders", href: "/waiter/orders", icon: ShoppingCart },
      { name: "Menu", href: "/waiter/menu", icon: ClipboardList },
    ],
  };

  const navItems = navigation[user.role] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <h1 className="text-xl font-bold text-orange-600">RestMan</h1>
            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
              {user.role}
            </span>
          </div>
          
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user.name || user.email}</p>
                <p className="text-xs text-gray-500">{user.restaurant.name}</p>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="pl-64">
        <main>{children}</main>
      </div>
    </div>
  );
}