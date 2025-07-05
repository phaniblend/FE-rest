// E:\projects\NRM\restman\app\api\onboarding\route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, address, city, phone, cuisines, menuItems, staffMembers } = body;

    // Start a transaction to create everything
    const restaurant = await db.restaurant.create({
      data: {
        name,
        address,
        city,
        phone,
        cuisines,
      },
    });

    // Create the owner user record
    await db.user.create({
      data: {
        clerkId: userId,
        role: "OWNER",
        restaurantId: restaurant.id,
      },
    });

    // Create menu items if provided
    if (menuItems && menuItems.length > 0) {
      await db.menuItem.createMany({
        data: menuItems.map((item: {
          name: string;
          description: string;
          price: number;
          category: string;
          cuisineType: string;
          isVeg: boolean;
        }) => ({
          ...item,
          restaurantId: restaurant.id,
          isAvailable: true,
        })),
      });
    }

    // TODO: Send invitations to staff members
    // For now, we'll just log them
    if (staffMembers && staffMembers.length > 0) {
      console.log("Staff members to invite:", staffMembers);
      // In a real app, you would:
      // 1. Send SMS/Email invitations
      // 2. Create pending invitations in database
      // 3. When they sign up, link them to this restaurant
    }

    return NextResponse.json({ 
      success: true, 
      restaurantId: restaurant.id,
      message: "Restaurant setup completed successfully!"
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}