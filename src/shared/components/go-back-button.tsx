"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/routes";

interface GoBackButtonProps {
  className?: string;
}

export function GoBackButton({ className }: GoBackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(ROUTES.HOME);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={className}
    >
      <ArrowLeft className="size-3.5" />
      <span>Go Back</span>
    </button>
  );
}
