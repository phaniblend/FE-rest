// E:\projects\NRM\restman\app\sign-in\[[...sign-in]]\page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
      <SignIn />
    </div>
  );
}