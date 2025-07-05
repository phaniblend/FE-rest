// E:\projects\NRM\restman\app\page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to RestMan
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The complete restaurant management solution
        </p>
        <div className="space-x-4">
          <Link href="/sign-in" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg">
            Sign In
          </Link>
          <Link href="/sign-up" className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}