// E:\projects\NRM\restman\app\api\generate-menu\route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { restaurantName, cuisines } = await req.json();

    // Generate menu using Anthropic
    const prompt = `Generate a restaurant menu for "${restaurantName}" that serves ${cuisines.join(", ")} cuisine.

Create a diverse menu with at least 15-20 items across different categories (Starters, Main Course, Desserts, Beverages).

Return the menu as a JSON array with this exact structure:
[
  {
    "name": "Dish Name",
    "description": "Brief appealing description",
    "price": 250,
    "category": "Starters",
    "cuisineType": "Indian",
    "isVeg": true
  }
]

Price should be in INR (Indian Rupees), realistic for the cuisine type.
Include both vegetarian and non-vegetarian options.
Make descriptions appetizing but concise.`;

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response");
      }

      const menuItems = JSON.parse(jsonMatch[0]);

      return NextResponse.json({ 
        success: true, 
        menuItems,
        source: "ai"
      });

    } catch (aiError) {
      console.error("AI generation failed:", aiError);
      
      // Fallback menu
      const fallbackMenu = generateFallbackMenu(cuisines);
      return NextResponse.json({ 
        success: true, 
        menuItems: fallbackMenu,
        source: "fallback"
      });
    }

  } catch (error) {
    console.error("Menu generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate menu" },
      { status: 500 }
    );
  }
}

function generateFallbackMenu(cuisines: string[]): any[] {
  const menus: Record<string, any[]> = {
    Indian: [
      { name: "Samosa", description: "Crispy fried pastry with spiced potato filling", price: 80, category: "Starters", cuisineType: "Indian", isVeg: true },
      { name: "Chicken Tikka", description: "Grilled chicken marinated in spices", price: 280, category: "Starters", cuisineType: "Indian", isVeg: false },
      { name: "Paneer Butter Masala", description: "Cottage cheese in rich tomato gravy", price: 320, category: "Main Course", cuisineType: "Indian", isVeg: true },
      { name: "Butter Chicken", description: "Creamy tomato-based chicken curry", price: 380, category: "Main Course", cuisineType: "Indian", isVeg: false },
      { name: "Dal Makhani", description: "Creamy black lentils slow-cooked overnight", price: 280, category: "Main Course", cuisineType: "Indian", isVeg: true },
      { name: "Gulab Jamun", description: "Deep-fried milk balls in sugar syrup", price: 120, category: "Desserts", cuisineType: "Indian", isVeg: true },
    ],
    Chinese: [
      { name: "Spring Rolls", description: "Crispy vegetable rolls with sweet chili sauce", price: 180, category: "Starters", cuisineType: "Chinese", isVeg: true },
      { name: "Chicken Manchurian", description: "Battered chicken in tangy sauce", price: 320, category: "Starters", cuisineType: "Chinese", isVeg: false },
      { name: "Veg Fried Rice", description: "Wok-tossed rice with vegetables", price: 240, category: "Main Course", cuisineType: "Chinese", isVeg: true },
      { name: "Chicken Fried Rice", description: "Wok-tossed rice with chicken and egg", price: 280, category: "Main Course", cuisineType: "Chinese", isVeg: false },
      { name: "Hakka Noodles", description: "Stir-fried noodles with vegetables", price: 220, category: "Main Course", cuisineType: "Chinese", isVeg: true },
    ],
    Italian: [
      { name: "Bruschetta", description: "Grilled bread with tomatoes and basil", price: 220, category: "Starters", cuisineType: "Italian", isVeg: true },
      { name: "Margherita Pizza", description: "Classic pizza with mozzarella and basil", price: 380, category: "Main Course", cuisineType: "Italian", isVeg: true },
      { name: "Pasta Carbonara", description: "Creamy pasta with bacon and egg", price: 420, category: "Main Course", cuisineType: "Italian", isVeg: false },
    ],
  };

  let combinedMenu: any[] = [];
  
  cuisines.forEach((cuisine) => {
    const cuisineMenu = menus[cuisine] || [];
    combinedMenu = [...combinedMenu, ...cuisineMenu];
  });

  // Add beverages
  combinedMenu.push(
    { name: "Fresh Lime Soda", description: "Refreshing lime drink", price: 80, category: "Beverages", cuisineType: "Universal", isVeg: true },
    { name: "Masala Chai", description: "Traditional spiced tea", price: 60, category: "Beverages", cuisineType: "Indian", isVeg: true },
  );

  return combinedMenu;
}