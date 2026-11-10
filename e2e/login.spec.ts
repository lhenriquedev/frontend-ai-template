import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("login renders and has no accessibility violations", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Entre na sua conta" })).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include("#root")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("login blocks submit while the required fields are empty", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Entrar", exact: true }).click();

  await expect(page.getByLabel("E-mail")).toBeFocused();
  await expect(page.getByLabel("E-mail")).toHaveJSProperty("validity.valueMissing", true);
});

test("login keeps the typed credentials on submit instead of reloading the page", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("E-mail").fill("ana@exemplo.com");
  await page.getByLabel("Senha").fill("senha-de-exemplo");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel("E-mail")).toHaveValue("ana@exemplo.com");
});
