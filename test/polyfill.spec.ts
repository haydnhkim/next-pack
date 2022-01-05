import { test, expect } from '@playwright/test';

// Next.js has logic to remove duplicate modules
// so, it is necessary to check whether all modules exist.
test('should be inserted a polyfill', async ({ page }) => {
  await page.goto('/');

  // In webpack 5, chunks are created separately even though set entry point name.
  const chunksSrcList = [];
  const scripts = await page.locator('script').elementHandles();
  for (const script of scripts) {
    const src = await script.getAttribute('src');
    if (!src || !src.includes('/_next/static/chunks')) continue;
    chunksSrcList.push(src);
  }

  const srcTexts = [];
  for (const src of chunksSrcList) {
    await page.goto(src).then(() => page.content());
    const srcText = await page.content();
    srcTexts.push(srcText);
  }
  const jsText = srcTexts.join('\n');

  // polyfills-nomodule
  expect(jsText.includes('classList')).toBeTruthy();
  expect(jsText.includes('html5')).toBeTruthy();
  expect(jsText.includes('window.location.origin')).toBeTruthy();

  // polyfills-module
  expect(jsText.includes('IntersectionObserver')).toBeTruthy();
  expect(jsText.includes('matchMedia')).toBeTruthy();
  expect(jsText.includes('proxy')).toBeTruthy();
  expect(jsText.includes('requestAnimationFrame')).toBeTruthy();
  expect(jsText.includes('next-head-count')).toBeTruthy();
});
