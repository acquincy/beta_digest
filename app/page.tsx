import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LandingPage } from "@/components/LandingPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sessionResult = await getSession();

  if (sessionResult.status === "authenticated") {
    if (sessionResult.session.onboardingCompleted) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  return <LandingPage />;
}
