import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn
    appearance={{
      elements: {
        formButtonPrimary:
          "bg-[#29235C] hover:bg-[#13152E] text-sm normal-case",
      },
    }}
     />;
}
