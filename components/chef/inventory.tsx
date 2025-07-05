// E:\projects\NRM\restman\components\chef\inventory.tsx
"use client";

import { useState } from "react";
import { Search, AlertTriangle, ShoppingCart, Calendar } from "lucide-react";

interface Props {
  inventory: any[];
}

export default function ChefInventory({ inventory }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [requisitionBag, setRequisitionBag] = useState<any[]>([]);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);
  const expiringItems = inventory.filter(item => {
    if (!item.expiryDate) return false;
    const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 3 && daysToExpiry > 0;
  });

  const addToRequisition = (item: any, quantity: number) => {
    const existing = requisitionBag.find(r => r.itemId === item.id);
    if (existing) {
      setRequisitionBag(requisitionBag.map(r => 
        r.itemId === item.id ? { ...r, quantity: r.quantity + quantity } : r
      ));
    } else {
      setRequisitionBag([...requisitionBag, { itemId: item.id, name: item.name, quantity, unit: item.unit }]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kitchen Inventory</h1>
        <p className="text-gray-600">Check stock levels and request items</p>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {lowStockItems.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">{lowStockItems.length} items running low</span>
            </div>
            <div className="mt-2 text-sm text-red-600">
              {lowStockItems.slice(0, 3).map(item => item.name).join(", ")}
              {lowStockItems.length > 3 && ` and ${lowStockItems.length - 3} more`}
            </div>
          </div>
        )}
        
        {expiringItems.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">{expiringItems.length} items expiring soon</span>
            </div>
            <div className="mt-2 text-sm text-yellow-600">
              Check and use these items first
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredInventory.map((item) => {
          const isLowStock = item.quantity <= item.minQuantity;
          const daysToExpiry = item.expiryDate ? 
            Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
          
          return (
            <div key={item.id} className={`bg-white rounded-lg border p-4 ${
              isLowStock ? 'border-red-300' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                  {item.category}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                    {item.quantity} {item.unit}
                  </span>
                </div>
                
                {daysToExpiry !== null && daysToExpiry <= 7 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires in:</span>
                    <span className={`font-medium ${daysToExpiry <= 3 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {daysToExpiry} days
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Yield:</span>
                  <span className="font-medium text-gray-900">~{Math.floor(item.quantity * 4)} portions</span>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <input
                  type="number"
                  placeholder="Qty"
                  className="w-20 px-2 py-1 border rounded text-sm"
                  id={`qty-${item.id}`}
                />
                <button
                  onClick={() => {
                    const qty = parseInt((document.getElementById(`qty-${item.id}`) as HTMLInputElement)?.value || "0");
                    if (qty > 0) addToRequisition(item, qty);
                  }}
                  className="flex-1 bg-orange-600 text-white py-1 px-3 rounded text-sm hover:bg-orange-700"
                >
                  Add to Requisition
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Requisition Bag */}
      {requisitionBag.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Requisition Bag
            </h3>
            <span className="text-sm text-gray-500">{requisitionBag.length} items</span>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {requisitionBag.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-medium">{item.quantity} {item.unit}</span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-3 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
            Send Requisition
          </button>
        </div>
      )}
    </div>
  );
}