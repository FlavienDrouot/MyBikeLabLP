import { expect, test } from '@playwright/test';

const THEME_COLORS = {
  light: 'rgb(244, 247, 250)',
  cream: 'rgb(248, 243, 235)',
  dark: 'rgb(25, 29, 34)',
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('mybikelab_lang', 'en');
  });
});

test('switches between the three Wave 5 themes and restores the choice', async ({ page }) => {
  await page.goto('#top');

  const themeGroup = page.getByRole('group', { name: 'Theme' });
  const html = page.locator('html');
  await expect(themeGroup).toBeVisible();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('transition-duration', '0s');

  for (const [theme, backgroundColor] of Object.entries(THEME_COLORS)) {
    const option = themeGroup.getByRole('button', { name: theme[0].toUpperCase() + theme.slice(1) });
    const switchState = await page.evaluate((nextTheme) => {
      document.querySelector(`[data-theme-choice="${nextTheme}"]`).click();
      const heroButton = document.querySelector('.hero .btn-primary');
      return {
        className: document.documentElement.className,
        transition: getComputedStyle(heroButton).transition,
      };
    }, theme);
    await expect(html).toHaveAttribute('data-theme', theme);
    await expect(option).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('body')).toHaveCSS('background-color', backgroundColor);
    expect(switchState.className).toContain('theme-switching');
    expect(switchState.transition).toBe('none');
    await expect.poll(() => html.evaluate((element) => element.classList.contains('theme-switching'))).toBe(false);
  }

  await expect(page.locator('body')).toHaveCSS('background-color', THEME_COLORS.dark);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(themeGroup.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
});
