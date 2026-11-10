import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import { featureStructure, noCrossFeatureImports } from "./feature-boundaries.js";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester();
const inOrders = (path) => `/repo/src/app/features/orders/${path}`;

ruleTester.run("feature-structure", featureStructure, {
  valid: [
    { code: "export const a = 1;", filename: inOrders("hooks/use-orders.js") },
    { code: "export const a = 1;", filename: inOrders("api/order-contract.js") },
    { code: "export const a = 1;", filename: inOrders("components/list/order-row.js") },
    { code: "export const a = 1;", filename: "/repo/src/app/shared/lib/index.js" },
  ],
  invalid: [
    { code: "export const a = 1;", filename: inOrders("use-orders.js"), errors: [{ messageId: "loose" }] },
    { code: "export const a = 1;", filename: inOrders("utils/format.js"), errors: [{ messageId: "folder" }] },
    { code: "export const a = 1;", filename: inOrders("hooks/index.js"), errors: [{ messageId: "barrel" }] },
  ],
});

ruleTester.run("no-cross-feature-imports", noCrossFeatureImports, {
  valid: [
    { code: 'import { a } from "@app/features/orders/api/order-contract";', filename: inOrders("hooks/use-orders.js") },
    { code: 'import { a } from "../api/order-contract";', filename: inOrders("hooks/use-orders.js") },
    { code: 'import { a } from "@app/shared/ui/button";', filename: inOrders("pages/order-page.js") },
    { code: 'import { a } from "@app/features/orders/pages/order-page";', filename: "/repo/src/app/routes/orders.js" },
  ],
  invalid: [
    {
      code: 'import { a } from "@app/features/customers/api/customer-contract";',
      filename: inOrders("hooks/use-orders.js"),
      errors: [{ messageId: "crossFeature" }],
    },
    {
      code: 'import { a } from "../../customers/hooks/use-customers";',
      filename: inOrders("hooks/use-orders.js"),
      errors: [{ messageId: "crossFeature" }],
    },
    {
      code: 'export { a } from "@app/features/customers/api/customer-contract";',
      filename: inOrders("api/order-contract.js"),
      errors: [{ messageId: "crossFeature" }],
    },
    {
      code: 'const page = import("@app/features/customers/pages/customer-page");',
      filename: inOrders("pages/order-page.js"),
      errors: [{ messageId: "crossFeature" }],
    },
  ],
});
