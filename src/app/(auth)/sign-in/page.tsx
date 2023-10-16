"use client"

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { resolvedTheme } = useTheme()
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
          elements: {
            formButtonPrimary:
              "bg-[#29235C] hover:bg-[#13152E] text-sm normal-case",
          },
        }}
      />
    </div>);
}
