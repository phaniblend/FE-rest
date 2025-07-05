// E:\projects\NRM\restman\app\unauthorized\page.tsx
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}