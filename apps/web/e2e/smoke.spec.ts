import { expect, test } from "@playwright/test";

test("home and browse load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("ClassOS").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Browse topics/i })).toBeVisible();
  await page.goto("/browse?class=10&subject=mathematics");
  await expect(page.getByRole("heading", { name: "Browse" })).toBeVisible();
  await expect(page.getByText("Quadratic Equations")).toBeVisible();
  await expect(page.getByText("Arithmetic Progressions")).toBeVisible();
});

test("learn quadratic and practice flow", async ({ page }) => {
  await page.goto("/learn/math.10.quadratic-equations.discriminant");
  await expect(page.getByText("Nature of roots / discriminant")).toBeVisible();
  await page.getByRole("tab", { name: "Build" }).click();
  await expect(page.getByRole("button", { name: "Explain verified steps" })).toBeVisible();

  await page.goto("/practice/math.10.quadratic-equations.discriminant");
  await expect(page.getByRole("heading", { name: /Practice/ })).toBeVisible();
  await page.getByRole("button", { name: "Two distinct real roots" }).click();
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByText(/Correct|Not yet|Verified/)).toBeVisible();
});

test("board hosts new maths widgets", async ({ page }) => {
  await page.goto("/board");
  await page.getByRole("button", { name: "AP", exact: true }).click();
  await expect(page.getByText("Arithmetic progression")).toBeVisible();
  await page.getByRole("button", { name: "Linear", exact: true }).click();
  await expect(page.getByText("Linear system lab")).toBeVisible();
});
