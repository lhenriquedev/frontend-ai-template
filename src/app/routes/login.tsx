import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@app/features/auth/pages/login-page";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
