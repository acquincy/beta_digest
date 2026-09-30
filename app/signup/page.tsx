import type { Metadata } from "next";
import { SignupForm } from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Subscribe — BetaDigest Morning Edition",
  description: "Subscribe to the five-minute morning news and hyperlocal weather digest.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const initialEmail = typeof params.email === "string" ? params.email : "";

  return <SignupForm initialEmail={initialEmail} />;
}
