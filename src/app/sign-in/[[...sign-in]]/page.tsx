import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

export const metadata: Metadata = {
  title: "Sign in · Fastlane",
  description: "Sign in to access your autonomous SaaS marketing and ad acquisition engine.",
};

export default function SignInPage() {
  return <AuthSplitLayout mode="sign-in" />;
}
