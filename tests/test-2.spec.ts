import { test, expect } from '@playwright/test';

test('delete thread', async ({ page }) => {
await page.goto('http://localhost:5173/login');
await page.getByRole('textbox', { name: 'Email' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('frida');
await page.getByRole('textbox', { name: 'Email' }).press('Alt+@');
await page.getByRole('textbox', { name: 'Email' }).fill('frida@gmail.com');
await page.getByRole('textbox', { name: 'Email' }).press('Tab');
await page.getByRole('textbox', { name: 'Password' }).fill('tester');
await page.getByRole('button', { name: 'Log In' }).click();
await page.getByRole('link', { name: '+ New' }).click();
await page.getByRole('textbox', { name: 'Type your message here...' }).click();
await page.getByRole('textbox', { name: 'Type your message here...' }).fill('Hvad hedder du?');
await page.getByRole('textbox', { name: 'Type your message here...' }).press('Enter');
await page.getByRole('button', { name: 'Delete thread: Hvad hedder du?' }).click();});