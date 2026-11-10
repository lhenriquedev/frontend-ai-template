import { Link } from "@tanstack/react-router";
import { GalleryVerticalEndIcon } from "lucide-react";
import { LoginForm } from "@app/features/auth/components/login-form";

export function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <header className="flex justify-center md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" aria-hidden="true" />
            </span>
            Acme Inc.
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </main>
      </div>
      <div className="hidden bg-muted lg:block" />
    </div>
  );
}
