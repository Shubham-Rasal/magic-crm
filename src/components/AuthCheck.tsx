"use client";

import { useSession } from "next-auth/react";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin h-8 w-8 border-4 border-[rgb(39,154,170)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}
