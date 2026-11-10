import { Link } from "@tanstack/react-router";
import { CompassIcon } from "lucide-react";
import { buttonVariants } from "@app/shared/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@app/shared/ui/empty";

export function RouteNotFound() {
  return (
    <main className="flex h-full">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CompassIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>
            <h1>Página não encontrada</h1>
          </EmptyTitle>
          <EmptyDescription>O endereço não existe ou foi movido.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            Voltar ao início
          </Link>
        </EmptyContent>
      </Empty>
    </main>
  );
}
