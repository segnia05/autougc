import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

export const metadata: Metadata = {
  title: "Create account · AutoUGC",
  description: "Create your AutoUGC account to scale high-converting UGC video ads automatically.",
};

export default function SignUpPage() {
  return <AuthSplitLayout mode="sign-up" />;
}
