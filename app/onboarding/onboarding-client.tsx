// E:\projects\NRM\restman\app\onboarding\onboarding-client.tsx
"use client";

import dynamic from "next/dynamic";

const OnboardingForm = dynamic(() => import("@/components/onboarding-form"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function OnboardingClient() {
  return <OnboardingForm />;
}