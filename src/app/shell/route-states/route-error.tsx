import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@app/shared/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@app/shared/ui/empty";

export function RouteError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  const queryErrorBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    queryErrorBoundary.reset();
  }, [queryErrorBoundary]);

  function retry() {
    reset();
    void router.invalidate();
  }

  return (
    <Empty role="alert">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Algo deu errado</EmptyTitle>
        <EmptyDescription>Não foi possível carregar esta tela.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={retry}>
          <RotateCwIcon data-icon="inline-start" aria-hidden="true" />
          Tentar de novo
        </Button>
      </EmptyContent>
    </Empty>
  );
}
