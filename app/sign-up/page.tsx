// E:\projects\NRM\restman\app\sign-up\[[...sign-up]]\page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
      <SignUp />
    </div>
  );
}