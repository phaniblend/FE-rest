// E:\projects\NRM\restman\app\dashboard\page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user exists in our database
  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { restaurant: true }
  });

  // If user doesn't exist or doesn't have a restaurant, redirect to onboarding
  if (!dbUser || !dbUser.restaurant) {
    redirect("/onboarding");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome back to {dbUser.restaurant.name}!</h2>
        <p className="text-gray-600 mb-4">
          Hello, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "User"}!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Today's Orders</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Active Tables</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Today's Revenue</h3>
            <p className="text-3xl font-bold">₹0</p>
          </div>
        </div>
      </div>
    </div>
  );
}