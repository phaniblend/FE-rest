// E:\projects\NRM\restman\components\onboarding-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CUISINE_OPTIONS = [
  "Indian",
  "Chinese", 
  "Italian",
  "Mexican",
  "Thai",
  "Japanese",
  "Continental",
  "Mediterranean",
  "American",
  "Korean"
];

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  cuisineType: string;
  isVeg: boolean;
}

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatingMenu, setGeneratingMenu] = useState(false);
  const [generatedMenu, setGeneratedMenu] = useState<MenuItem[]>([]);
  const [deselectedItems, setDeselectedItems] = useState<Set<string>>(new Set());
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});
  
  // Form data
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    cuisines: [] as string[],
  });

  const [staffMembers, setStaffMembers] = useState([
    { phone: "", role: "MANAGER", name: "" }
  ]);

  const handleNext = async () => {
    if (step === 2 && restaurantData.cuisines.length > 0) {
      // After selecting cuisines, generate menu
      await generateMenu();
      setStep(3);
    } else if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete setup
      handleCompleteSetup();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleCuisine = (cuisine: string) => {
    const newCuisines = restaurantData.cuisines.includes(cuisine)
      ? restaurantData.cuisines.filter(c => c !== cuisine)
      : [...restaurantData.cuisines, cuisine];
    setRestaurantData({ ...restaurantData, cuisines: newCuisines });
  };

  const generateMenu = async () => {
    setGeneratingMenu(true);
    try {
      const response = await fetch("/api/generate-menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantName: restaurantData.name,
          cuisines: restaurantData.cuisines,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate menu");
      }

      const data = await response.json();
      setGeneratedMenu(data.menuItems);
    } catch (error) {
      console.error("Menu generation error:", error);
      // Use fallback menu
      setGeneratedMenu([
        {
          name: "Butter Chicken",
          description: "Creamy tomato-based curry",
          price: 450,
          category: "Main Course",
          cuisineType: "Indian",
          isVeg: false
        },
        {
          name: "Paneer Tikka",
          description: "Grilled cottage cheese",
          price: 350,
          category: "Starters",
          cuisineType: "Indian",
          isVeg: true
        }
      ]);
    } finally {
      setGeneratingMenu(false);
    }
  };

  const toggleItemSelection = (itemKey: string) => {
    const newDeselected = new Set(deselectedItems);
    if (newDeselected.has(itemKey)) {
      newDeselected.delete(itemKey);
    } else {
      newDeselected.add(itemKey);
    }
    setDeselectedItems(newDeselected);
  };

  const updateItemPrice = (itemKey: string, price: number) => {
    setEditedPrices(prev => ({ ...prev, [itemKey]: price }));
  };

  const addStaffMember = () => {
    setStaffMembers([...staffMembers, { phone: "", role: "WAITER", name: "" }]);
  };

  const removeStaffMember = (index: number) => {
    setStaffMembers(staffMembers.filter((_, i) => i !== index));
  };

  const updateStaffMember = (index: number, field: string, value: string) => {
    const updated = [...staffMembers];
    updated[index] = { ...updated[index], [field]: value };
    setStaffMembers(updated);
  };

  const handleCompleteSetup = async () => {
    setLoading(true);
    try {
      // Filter and update menu items
      const finalMenuItems = generatedMenu
        .map((item, index) => {
          const itemKey = `${item.category}-${generatedMenu.filter(i => i.category === item.category).indexOf(item)}`;
          if (deselectedItems.has(itemKey)) return null;
          
          return {
            ...item,
            price: editedPrices[itemKey] ?? item.price
          };
        })
        .filter(Boolean);

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...restaurantData,
          menuItems: finalMenuItems,
          staffMembers: staffMembers.filter(s => s.phone),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete setup");
      }

      const data = await response.json();
      console.log("Setup completed:", data);
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Setup error:", error);
      alert("Failed to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-2 mx-1 rounded-full ${
              i <= step ? "bg-orange-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Restaurant Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Restaurant Details</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Restaurant Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={restaurantData.name}
              onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
              placeholder="Enter restaurant name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={restaurantData.address}
              onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={restaurantData.city}
              onChange={(e) => setRestaurantData({ ...restaurantData, city: e.target.value })}
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={restaurantData.phone}
              onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
        </div>
      )}

      {/* Step 2: Choose Cuisines */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Choose Cuisines</h2>
          <p className="text-gray-600">Select all the cuisines your restaurant serves</p>
          <div className="grid grid-cols-2 gap-3">
            {CUISINE_OPTIONS.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => toggleCuisine(cuisine)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  restaurantData.cuisines.includes(cuisine)
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Generated Menu */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your AI-Generated Menu</h2>
          {generatingMenu ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-gray-600">Generating menu with AI...</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">Review and customize your menu. Uncheck items you don't want to include.</p>
              
              {/* Group items by category */}
              {Object.entries(
                generatedMenu.reduce((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                  return acc;
                }, {} as Record<string, typeof generatedMenu>)
              ).map(([category, items]) => (
                <div key={category} className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item, index) => {
                      const itemKey = `${category}-${index}`;
                      const isSelected = !deselectedItems.has(itemKey);
                      
                      return (
                        <div 
                          key={itemKey} 
                          className={`border rounded-lg p-4 transition-all ${
                            isSelected ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleItemSelection(itemKey)}
                              className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      item.isVeg 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                      {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                                    </span>
                                    <span className="text-xs text-gray-500">{item.cuisineType}</span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-1">₹</span>
                                    <input
                                      type="number"
                                      value={editedPrices[itemKey] ?? item.price}
                                      onChange={(e) => updateItemPrice(itemKey, parseInt(e.target.value) || 0)}
                                      className="w-20 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-orange-500"
                                      disabled={!isSelected}
                                      min="0"
                                      max="9999"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 Tip: You can edit prices now or change them later from your dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Invite Team */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Invite Your Team</h2>
          <p className="text-gray-600">Add team members by their phone numbers</p>
          
          <div className="space-y-3">
            {staffMembers.map((member, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="flex-1 px-3 py-2 border rounded-lg"
                  value={member.name}
                  onChange={(e) => updateStaffMember(index, "name", e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="flex-1 px-3 py-2 border rounded-lg"
                  value={member.phone}
                  onChange={(e) => updateStaffMember(index, "phone", e.target.value)}
                />
                <select
                  className="px-3 py-2 border rounded-lg"
                  value={member.role}
                  onChange={(e) => updateStaffMember(index, "role", e.target.value)}
                >
                  <option value="MANAGER">Manager</option>
                  <option value="CHEF">Chef</option>
                  <option value="WAITER">Waiter</option>
                </select>
                {staffMembers.length > 1 && (
                  <button
                    onClick={() => removeStaffMember(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={addStaffMember}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400"
          >
            + Add Another Team Member
          </button>
          
          <p className="text-sm text-gray-500 text-center">
            You can skip this and add team members later from the dashboard
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`px-6 py-2 rounded-lg ${
            step === 1 ? "invisible" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading || (step === 2 && restaurantData.cuisines.length === 0) || generatingMenu}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : step === 4 ? "Complete Setup" : "Next"}
        </button>
      </div>
    </div>
  );
}