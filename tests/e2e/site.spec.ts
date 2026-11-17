import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
});
test("navigation and service selection", async ({ page }) => {
  await page
    .getByRole("navigation", { name: "Основная навигация", exact: true })
    .getByRole("link", { name: "Услуги", exact: true })
    .click();
  await expect(page).toHaveURL(/#services/);
  await page
    .getByRole("button", { name: "Салон", exact: true })
    .first()
    .click();
  await expect(page.locator(".service-card")).toHaveCount(3);
  await page.getByRole("button", { name: /Все услуги/ }).click();
  await expect(page.locator(".service-card")).toHaveCount(12);
  await page.locator('[data-service="polish"]').getByRole("button").click();
  await expect(page.locator("#service")).toHaveValue("polish");
});
test("validates and completes without sending personal data", async ({
  page,
}) => {
  const personalRequests: string[] = [];
  page.on("request", (r) => {
    if (r.postData()?.includes("Тестовый")) personalRequests.push(r.url());
  });
  await page.locator(".submit").click();
  await expect(
    page.getByText("Введите ваше имя", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Подтвердите условия формы")).toBeVisible();
  await page.locator("#client-name").fill("Тестовый");
  await page.locator("#phone").fill("89991234567");
  await expect(page.locator("#phone")).toHaveValue("+7 (999) 123-45-67");
  await page.locator("#service").selectOption("polish");
  await page.locator('[name="consent"]').check();
  await page.locator(".submit").click();
  await expect(
    page.getByRole("heading", { name: "Заявка заполнена" }),
  ).toBeVisible();
  expect(personalRequests).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await page.getByRole("button", { name: "Заполнить ещё раз" }).click();
  await expect(page.locator("#client-name")).toHaveValue("");
  await expect(page.locator("#service")).toHaveValue("");
});
test("gallery filters, expansion, keyboard and focus", async ({ page }) => {
  await expect(page.locator(".portfolio-item")).toHaveCount(6);
  await page.getByRole("button", { name: "Показать ещё" }).click();
  await expect(page.locator(".portfolio-item")).toHaveCount(9);
  const first = page.locator(".portfolio-item").first();
  await first.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".lightbox-title")).toContainText("2 / 9");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(first).toBeFocused();
  await page
    .locator("#portfolio")
    .getByRole("button", { name: "Салон", exact: true })
    .click();
  await expect(page.locator(".portfolio-item")).toHaveCount(2);
});
test("reviews form a continuous leftward marquee with fading edges", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const region = page.getByRole("region", { name: "Отзывы клиентов" });
  await region.scrollIntoViewIfNeeded();
  await expect(region.locator(".review-marquee-track")).toHaveCSS(
    "animation-name",
    "reviews-marquee",
  );
  await expect(
    page.locator("#reviews .review-controls, #reviews .review-dots"),
  ).toHaveCount(0);
  await expect(region.getByRole("article")).toHaveCount(3);
  const movesLeft = await region
    .locator(".review-marquee-track")
    .evaluate(async (el) => {
      const x = () => new DOMMatrix(getComputedStyle(el).transform).m41;
      const before = x();
      await new Promise((resolve) => setTimeout(resolve, 160));
      return x() < before;
    });
  expect(movesLeft).toBe(true);
  await region.hover();
  await expect(region.locator(".review-marquee-track")).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await page.mouse.move(0, 0);
  await page.getByRole("button", { name: "Приостановить отзывы" }).click();
  await expect(region.locator(".review-marquee-track")).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await page.getByRole("button", { name: "Продолжить отзывы" }).click();
  await expect(region.locator(".review-marquee-track")).toHaveCSS(
    "animation-play-state",
    "running",
  );
});
test("reviews stay readable without animation", async ({ page }) => {
  const region = page.getByRole("region", { name: "Отзывы клиентов" });
  await region.scrollIntoViewIfNeeded();
  await expect(region.locator(".review-marquee-track")).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  for (const card of await region.getByRole("article").all())
    await expect(card).toBeVisible();
});
test("responsive widths have no horizontal overflow", async ({ page }) => {
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
  }
});
test("mobile menu focus, Escape and CTA", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Открыть меню" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page
    .getByRole("navigation", { name: "Мобильная навигация" })
    .getByRole("link", { name: /Услуги/ })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator(".mobile-cta a").click();
  await expect(page).toHaveURL(/#lead/);
});
test("touch swipes switch lightbox images", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".portfolio-item").first().click();
  await page.locator(".lightbox").evaluate((el) => {
    const e = new Event("touchstart", { bubbles: true });
    Object.defineProperty(e, "changedTouches", { value: [{ clientX: 280 }] });
    el.dispatchEvent(e);
  });
  await page.locator(".lightbox").evaluate((el) => {
    const e = new Event("touchend", { bubbles: true });
    Object.defineProperty(e, "changedTouches", { value: [{ clientX: 70 }] });
    el.dispatchEvent(e);
  });
  await expect(page.locator(".lightbox-title")).toContainText("2 / 9");
  await page.getByRole("button", { name: "Закрыть фото" }).click();
});
test("phone mask supports repeated backspace and paste", async ({ page }) => {
  const phone = page.locator("#phone");
  await phone.fill("+7 (999) 123-45-67");
  await phone.press("End");
  await phone.press("Backspace");
  await expect(phone).toHaveValue("+7 (999) 123-45-6");
  for (let i = 0; i < 10; i++) await phone.press("Backspace");
  await expect(phone).toHaveValue("");
});

test("success receives focus with full animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#client-name").fill("Олег");
  await page.locator("#phone").fill("89991234567");
  await page.locator("#service").selectOption("polish");
  await page.locator('[name="consent"]').check();
  await page.locator(".submit").click();
  await expect(page.locator(".success")).toBeFocused();
});

test("active navigation follows each anchor and manual scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const nav = page.getByRole("navigation", {
    name: "Основная навигация",
    exact: true,
  });
  for (const id of [
    "services",
    "about",
    "portfolio",
    "reviews",
    "contacts",
    "process",
  ]) {
    await nav.locator(`a[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(nav.locator('[aria-current="location"]')).toHaveAttribute(
      "href",
      `#${id}`,
    );
    await expect
      .poll(() =>
        page.locator(`#${id}`).evaluate((el) => {
          const target = Math.min(
            el.getBoundingClientRect().top + window.scrollY - 30,
            document.documentElement.scrollHeight - window.innerHeight,
          );
          return Math.abs(window.scrollY - target);
        }),
      )
      .toBeLessThanOrEqual(1);
  }
  await page.evaluate(() => {
    const section = document.getElementById("services")!;
    window.scrollTo({
      top: section.offsetTop + section.offsetHeight / 2,
      behavior: "instant",
    });
  });
  await expect(nav.locator('[aria-current="location"]')).toHaveAttribute(
    "href",
    "#services",
  );
  await page.evaluate(() =>
    document.getElementById("lead")!.scrollIntoView({ behavior: "instant" }),
  );
  await expect(nav.locator("[aria-current]")).toHaveCount(0);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(nav.locator("[aria-current]")).toHaveCount(0);
});

test("active navigation stays correct after smooth scrolling and direct anchors", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const nav = page.locator(".desktop-nav");
  for (const id of ["contacts", "portfolio", "about", "services"]) {
    await nav.locator(`a[href="#${id}"]`).click();
    await expect
      .poll(() =>
        page.locator(`#${id}`).evaluate((el) => {
          const target = Math.min(
            el.getBoundingClientRect().top + scrollY - 30,
            document.documentElement.scrollHeight - innerHeight,
          );
          return Math.abs(scrollY - target);
        }),
      )
      .toBeLessThanOrEqual(1);
    await expect(nav.locator('[aria-current="location"]')).toHaveAttribute(
      "href",
      `#${id}`,
    );
  }
  await page.goto("/#process");
  await expect(nav.locator('[aria-current="location"]')).toHaveAttribute(
    "href",
    "#process",
  );
});

test("hero beams stay decorative, contained and static with reduced motion", async ({
  page,
}) => {
  const background = page.locator("#home .hero-beams");
  await expect(background).toHaveAttribute("aria-hidden", "true");
  await expect(background).toHaveCSS("pointer-events", "none");
  const canvas = background.locator("canvas");
  await expect
    .poll(() => canvas.evaluate((el: HTMLCanvasElement) => el.width))
    .toBeGreaterThan(0);
  const firstFrame = await canvas.evaluate((el: HTMLCanvasElement) =>
    el.toDataURL(),
  );
  const nextFrame = await canvas.evaluate(async (el: HTMLCanvasElement) => {
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
    return el.toDataURL();
  });
  expect(nextFrame === firstFrame).toBe(true);
  await expect(page.locator("#home h1")).toContainText("Профессиональный");
  await page
    .locator("#home")
    .getByRole("link", { name: "Наши услуги" })
    .click();
  await expect(page).toHaveURL(/#services$/);
});

test("advantages sparkles are decorative and keep all cards readable", async ({
  page,
}) => {
  await page.locator("#advantages").scrollIntoViewIfNeeded();
  const background = page.locator("#advantages .advantages-sparkles");
  await expect(background).toHaveAttribute("aria-hidden", "true");
  await expect(background).toHaveCSS("pointer-events", "none");
  await expect(background.locator("canvas")).toBeVisible();
  await expect(page.locator("#advantages .advantage")).toHaveCount(6);
  await expect(page.locator("#advantages h2")).toBeVisible();
  const still = await background
    .locator("canvas")
    .evaluate(async (el: HTMLCanvasElement) => {
      const first = el.toDataURL();
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      return first === el.toDataURL();
    });
  expect(still).toBe(true);
});
