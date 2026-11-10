import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("unknown address shows the not-found screen and leads back home", async ({ page }) => {
  await page.goto("/endereco-que-nao-existe");

  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include("#root")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);

  await page.getByRole("link", { name: "Voltar ao início" }).click();
  await expect(page.getByRole("heading", { name: "Projeto criado" })).toBeVisible();
});
