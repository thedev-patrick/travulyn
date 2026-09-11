"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });
    return { status: "idle" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: "Invalid email or password." };
    }
    throw error;
  }
}
