// E:\projects\NRM\restman\components\chef\dashboard.tsx
"use client";

import { useState } from "react";
import { Clock, CheckCircle, AlertCircle, Flame } from "lucide-react";

interface Props {
  orders: any[];
  user: any;
}

export default function ChefDashboard({ orders, user }: Props) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const pendingOrders = orders.filter(o => o.status === "PENDING");
  const preparingOrders = orders.filter(o => o.status === "PREPARING");

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        // Refresh the page or update state
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kitchen Dashboard</h1>
        <p className="text-gray-600">Welcome, Chef {user.name || user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-red-700">{pendingOrders.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Preparing</p>
              <p className="text-2xl font-bold text-orange-700">{preparingOrders.length}</p>
            </div>
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed Today</p>
              <p className="text-2xl font-bold text-green-700">42</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Avg Time</p>
              <p className="text-2xl font-bold text-blue-700">18m</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-red-700">Pending Orders</h2>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-white border-2 border-red-200 rounded-lg p-4 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-lg font-semibold">Order #{order.orderNumber}</span>
                    <span className="ml-2 text-sm text-gray-500">Table {order.table?.number}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      {item.notes && (
                        <span className="text-orange-600 text-xs">Note: {item.notes}</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => updateOrderStatus(order.id, "PREPARING")}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
                >
                  Start Preparing
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preparing Orders */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-700">Preparing</h2>
          <div className="space-y-4">
            {preparingOrders.map((order) => (
              <div key={order.id} className="bg-white border-2 border-orange-200 rounded-lg p-4 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-lg font-semibold">Order #{order.orderNumber}</span>
                    <span className="ml-2 text-sm text-gray-500">Table {order.table?.number}</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>15 mins</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-orange-600 rounded"
                      />
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => updateOrderStatus(order.id, "READY")}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Mark as Ready
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}