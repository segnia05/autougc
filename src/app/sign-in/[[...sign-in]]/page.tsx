import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

export const metadata: Metadata = {
  title: "Sign in · AutoUGC",
  description: "Sign in to access your autonomous SaaS video ad engine.",
};

export default function SignInPage() {
  return <AuthSplitLayout mode="sign-in" />;
}
