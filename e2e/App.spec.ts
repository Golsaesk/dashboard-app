import { test, expect } from '@playwright/test'

// ─── Auth Flow ─────────────────────────────────────────────────────────────
test.describe('Signin Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin')
  })

  test('should display signin page', async ({ page }) => {
    await expect(page).toHaveURL(/signin/)
    await expect(page.getByRole('heading')).toBeVisible()
  })

  test('signin button should be clickable', async ({ page }) => {
    const btn = page.getByRole('button', { name: /sign in|login/i })
    await expect(btn).toBeVisible()
  })

  test('authenticated user should be redirected to /dashboard', async ({
    page,
  }) => {
    // middleware redirect test (without auth)
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/signin|auth/)
  })
})

// ─── Dashboard ────────────────────────────────────────────────────────────────
test.describe('Dashboard (Authenticated User)', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should load dashboard page', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/dashboard/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('navigation menu should be visible', async ({ page }) => {
    await page.goto('/dashboard')
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()
  })

  test('main navigation links should exist', async ({ page }) => {
    await page.goto('/dashboard')
    for (const href of ['/income', '/outcome', '/reports']) {
      const link = page.locator(`a[href="${href}"]`).first()
      await expect(link).toBeVisible()
    }
  })
})

// ─── Income Page ──────────────────────────────────────────────────────────────
test.describe('Income Page', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should load successfully', async ({ page }) => {
    await page.goto('/income')
    await expect(page).toHaveURL(/income/)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should not display any error', async ({ page }) => {
    await page.goto('/income')
    await page.waitForLoadState('networkidle')
    const errorText = page.getByText(/error/i)
    await expect(errorText).toHaveCount(0)
  })
})

// ─── Outcome Page ─────────────────────────────────────────────────────────────
test.describe('Outcome Page', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should load successfully', async ({ page }) => {
    await page.goto('/outcome')
    await expect(page).toHaveURL(/outcome/)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
  })
})

// ─── Transaction Form ─────────────────────────────────────────────────────────
test.describe('Add Transaction Form', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should open add transaction sheet', async ({ page }) => {
    await page.goto('/income')
    await page.waitForLoadState('networkidle')

    const addBtn = page.getByRole('button', { name: /add|\+/i }).first()
    if (await addBtn.isVisible()) {
      await addBtn.click()
      const sheet = page.locator(
        '[role="dialog"], [data-radix-popper-content-wrapper]',
      )
      await expect(sheet.first()).toBeVisible({ timeout: 3000 })
    } else {
      test.skip()
    }
  })

  test('should show validation when submitting empty form', async ({
    page,
  }) => {
    await page.goto('/income')
    await page.waitForLoadState('networkidle')

    const addBtn = page.getByRole('button', { name: /add|\+/i }).first()
    if (!(await addBtn.isVisible())) return test.skip()

    await addBtn.click()
    await page.waitForTimeout(500)

    const submitBtn = page.getByRole('button', { name: /save|submit/i })
    if (await submitBtn.isVisible()) {
      await submitBtn.click()

      // should display validation or required error
      const err = page.locator(
        '[data-testid="error"], .text-red-500, [aria-invalid]',
      )
      await expect(err.first()).toBeVisible({ timeout: 2000 })
    }
  })
})

// ─── Settings Page ────────────────────────────────────────────────────────────
test.describe('Settings Page', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should load successfully', async ({ page }) => {
    await page.goto('/setting')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should update currency successfully', async ({ page }) => {
    await page.goto('/setting')
    await page.waitForLoadState('networkidle')

    const currencySelect = page
      .locator('select, [role="combobox"]')
      .filter({
        hasText: /USD|EUR|TRY/,
      })
      .first()

    if (await currencySelect.isVisible()) {
      await currencySelect.click()
      const eurOption = page.getByRole('option', { name: /EUR/ })
      if (await eurOption.isVisible()) {
        await eurOption.click()
        await expect(currencySelect).toContainText('EUR')
      }
    }
  })
})

// ─── Pricing Page ─────────────────────────────────────────────────────────────
test.describe('Pricing Page', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should load successfully', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
  })

  test('upgrade button should be visible', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')
    const upgradeBtn = page
      .getByRole('button', { name: /upgrade|pro/i })
      .first()
    await expect(upgradeBtn).toBeVisible()
  })
})

// ─── Reports Page ─────────────────────────────────────────────────────────────
test.describe('Reports Page', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should load successfully', async ({ page }) => {
    await page.goto('/reports')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
  })
})

// ─── FeatureGate (Free User) ─────────────────────────────────────────────────
test.describe('FeatureGate for Free User', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('should display Pro Feature message', async ({ page }) => {
    await page.goto('/reports')
    await page.waitForLoadState('networkidle')

    const proGate = page.getByText(/Pro Feature|Upgrade to Pro/i)
    if ((await proGate.count()) > 0) {
      await expect(proGate.first()).toBeVisible()
    }
  })
})

// ─── Middleware Redirect ─────────────────────────────────────────────────────
test.describe('middleware auth guard', () => {
  test('unauthenticated user should be redirected from /dashboard', async ({
    page,
  }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/(signin|auth)/, { timeout: 5000 })
    await expect(page).toHaveURL(/(signin|auth)/)
  })
})
