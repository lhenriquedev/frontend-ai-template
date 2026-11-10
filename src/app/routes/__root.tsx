import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { RouterContext } from "@app/shell/providers/router-context";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});
