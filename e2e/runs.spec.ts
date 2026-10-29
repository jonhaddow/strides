import { expect, test } from '@playwright/test';
import { open } from './helpers.ts';

test('lists runs by month with their grades', async ({ page }) => {
	await open(page, '/');
	await expect(page.getByRole('heading', { name: 'October 2026' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'September 2026' })).toBeVisible();
	const hut = page.getByRole('link', { name: /Hut run\/walk/ });
	await expect(hut).toContainText('15.93 km');
	await expect(hut).toContainText('E');
});

test('logs a run, filling in a known route', async ({ page }) => {
	await open(page, '/runs/new');
	await page.getByLabel('Route').fill('Valley extended');
	await page.getByLabel('Route').blur();
	// Filled in from the last time.
	await expect(page.getByLabel('Distance (km)')).toHaveValue('8.30');
	await expect(page.getByLabel('Elevation gain (m)')).toHaveValue('119');
	await expect(page.getByLabel('Mixed')).toBeChecked();
	await expect(page.getByLabel('Date')).not.toHaveValue('');

	await page.getByLabel('Date').fill('2026-10-25');
	await page.getByLabel('Time (min.sec)').fill('51:08');
	await expect(page.getByText('Grade C · score 18.0')).toBeVisible();
	await page.getByRole('button', { name: 'Save run' }).click();

	await expect(page.getByRole('heading', { name: 'Grade C' })).toBeVisible();
	await expect(page.getByText('Saved! Sun 25 Oct')).toBeVisible();
});

test('says what’s wrong with a run and keeps what was typed', async ({ page }) => {
	await open(page, '/runs/new');
	await page.getByLabel('Route').fill('Somewhere new');
	await page.getByLabel('Distance (km)').fill('4');
	await page.getByLabel('Time (min.sec)').fill('25:99');
	await page.getByLabel('Road').check();
	await page.getByRole('button', { name: 'Save run' }).click();
	await expect(page.getByRole('alert')).toHaveText('Time should be minutes.seconds, like 26.39.');
	await expect(page.getByLabel('Route')).toHaveValue('Somewhere new');
});

test('edits and deletes a run', async ({ page }) => {
	await open(page, '/');
	await page.getByRole('link', { name: /Spare run/ }).click();
	await expect(page.getByRole('heading', { name: 'Grade D' })).toBeVisible();

	await page.getByLabel('Time (min.sec)').fill('22:00');
	await page.getByRole('button', { name: 'Save changes' }).click();
	await expect(page.getByRole('link', { name: /Spare run/ })).toContainText('22:00');

	await page.getByRole('link', { name: /Spare run/ }).click();
	page.once('dialog', (d) => d.accept());
	await page.getByRole('button', { name: 'Delete this run' }).click();
	await expect(page.getByRole('heading', { name: 'Strides' })).toBeVisible();
	await expect(page.getByRole('link', { name: /Spare run/ })).toHaveCount(0);
});

test('shows totals, bests and grades', async ({ page }) => {
	await open(page, '/stats');
	await expect(page.getByRole('link', { name: /Longest run/ })).toContainText('15.93 km');
	await expect(page.getByRole('link', { name: /Most climb/ })).toContainText('348 m');
	await expect(page.getByRole('row', { name: /September 2026/ })).toContainText('5.65');
});
