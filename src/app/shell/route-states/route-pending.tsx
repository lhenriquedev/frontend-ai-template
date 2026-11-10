import { Skeleton } from "@app/shared/ui/skeleton";

export function RoutePending() {
  return (
    <div aria-busy="true" className="flex flex-1 flex-col gap-4 p-4">
      <span className="sr-only">Carregando tela…</span>
      <Skeleton aria-hidden="true" className="h-8 w-48" />
      <div className="flex flex-col gap-2">
        <Skeleton aria-hidden="true" className="h-4 w-full" />
        <Skeleton aria-hidden="true" className="h-4 w-5/6" />
        <Skeleton aria-hidden="true" className="h-4 w-2/3" />
      </div>
    </div>
  );
}
