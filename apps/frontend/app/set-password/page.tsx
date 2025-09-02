import { Suspense } from "react";
import SetPasswordPage from "./SetPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>}>
      <SetPasswordPage />
    </Suspense>
  );
}