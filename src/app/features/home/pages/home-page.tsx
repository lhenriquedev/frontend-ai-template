import { RocketIcon } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@app/shared/ui/empty";

export function HomePage() {
  return (
    <main className="flex h-full">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RocketIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>
            <h1>Projeto criado</h1>
          </EmptyTitle>
          <EmptyDescription>Troque esta tela pela primeira feature.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  );
}
