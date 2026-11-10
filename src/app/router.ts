import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./route-tree.gen";
import { queryClient } from "./shell/providers/query-client";
import { RouteError } from "./shell/route-states/route-error";
import { RouteNotFound } from "./shell/route-states/route-not-found";
import { RoutePending } from "./shell/route-states/route-pending";

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: RoutePending,
  defaultErrorComponent: RouteError,
  defaultNotFoundComponent: RouteNotFound,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
