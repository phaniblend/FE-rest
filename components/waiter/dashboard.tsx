// E:\projects\NRM\restman\components\waiter\dashboard.tsx
"use client";

import { useState } from "react";
import { Users, Clock, CheckCircle, Plus, Bell } from "lucide-react";

interface Props {
  tables: any[];
  menuItems: any[];
  user: any;
}

export default function WaiterDashboard({ tables, menuItems, user }: Props) {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any[]>([]);

  const occupiedTables = tables.filter(t => t.status === "OCCUPIED");
  const readyOrders = tables.flatMap(t => t.orders.filter((o: any) => o.status === "READY"));

  const getTableColor = (table: any) => {
    if (table.status === "FREE") return "bg-green-100 border-green-300";
    if (table.orders.some((o: any) => o.status === "READY")) return "bg-orange-100 border-orange-300";
    return "bg-red-100 border-red-300";
  };

  const addToOrder = (item: any) => {
    const existing = currentOrder.find(o => o.id === item.id);
    if (existing) {
      setCurrentOrder(currentOrder.map(o => 
        o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o
      ));
    } else {
      setCurrentOrder([...currentOrder, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Waiter Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.name || user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">My Tables</p>
              <p className="text-2xl font-bold text-blue-700">{occupiedTables.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Orders Ready</p>
              <p className="text-2xl font-bold text-orange-700">{readyOrders.length}</p>
            </div>
            <Bell className="h-8 w-8 text-orange-500 animate-pulse" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed Today</p>
              <p className="text-2xl font-bold text-green-700">18</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Avg Service Time</p>
              <p className="text-2xl font-bold text-purple-700">22m</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Ready Orders Alert */}
      {readyOrders.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-orange-600 animate-pulse" />
              <div>
                <p className="font-semibold text-orange-800">{readyOrders.length} orders ready for serving!</p>
                <p className="text-sm text-orange-600">
                  Tables: {readyOrders.map((o: any) => tables.find(t => t.id === o.tableId)?.number).join(", ")}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              View All
            </button>
          </div>
        </div>
      )}

      {/* Tables Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Restaurant Tables</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition hover:shadow-lg ${getTableColor(table)}`}
            >
              <div className="text-center">
                <p className="text-2xl font-bold">T{table.number}</p>
                <p className="text-sm text-gray-600">{table.capacity} seats</p>
                {table.status === "OCCUPIED" && (
                  <p className="text-xs mt-2 font-medium">
                    {table.orders.filter((o: any) => o.status !== "SERVED").length} active orders
                  </p>
                )}
                {table.orders.some((o: any) => o.status === "READY") && (
                  <p className="text-xs mt-1 text-orange-600 font-semibold">Order Ready!</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Table Details */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Table {selectedTable.number}</h2>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Table Actions */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => {
                    setShowOrderModal(true);
                    setSelectedTable(null);
                  }}
                  className="flex items-center justify-center gap-2 p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <Plus className="h-5 w-5" />
                  New Order
                </button>
                <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Bill
                </button>
              </div>
              
              {/* Active Orders */}
              {selectedTable.orders.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Active Orders</h3>
                  <div className="space-y-3">
                    {selectedTable.orders.map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">Order #{order.orderNumber}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === "READY" ? "bg-green-100 text-green-700" :
                            order.status === "PREPARING" ? "bg-orange-100 text-orange-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="text-sm text-gray-600">
                              {item.quantity}x {item.menuItem.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">New Order</h2>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setCurrentOrder([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Menu Items */}
                <div>
                  <h3 className="font-semibold mb-3">Menu</h3>
                  <div className="space-y-4">
                    {Object.entries(
                      menuItems.reduce((acc, item) => {
                        if (!acc[item.category]) acc[item.category] = [];
                        acc[item.category].push(item);
                        return acc;
                      }, {} as Record<string, typeof menuItems>)
                    ).map(([category, items]) => (
                      <div key={category}>
                        <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => addToOrder(item)}
                              className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">₹{item.price}</p>
                              </div>
                              <Plus className="h-5 w-5 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Current Order */}
                <div>
                  <h3 className="font-semibold mb-3">Current Order</h3>
                  {currentOrder.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No items added</p>
                  ) : (
                    <div className="space-y-2">
                      {currentOrder.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">₹{item.price} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (item.quantity === 1) {
                                  setCurrentOrder(currentOrder.filter(o => o.id !== item.id));
                                } else {
                                  setCurrentOrder(currentOrder.map(o => 
                                    o.id === item.id ? { ...o, quantity: o.quantity - 1 } : o
                                  ));
                                }
                              }}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => addToOrder(item)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">Total:</span>
                          <span className="text-xl font-bold">
                            ₹{currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                          </span>
                        </div>
                        
                        <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700">
                          Place Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}