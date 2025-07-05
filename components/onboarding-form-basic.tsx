// E:\projects\NRM\restman\components\onboarding-form-basic.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingFormBasic() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleComplete = async () => {
    setLoading(true);
    // For now, just redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome to RestMan!</h2>
      <p>Let's set up your restaurant.</p>
      
      <button
        onClick={handleComplete}
        disabled={loading}
        className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? "Setting up..." : "Complete Setup"}
      </button>
    </div>
  );
}