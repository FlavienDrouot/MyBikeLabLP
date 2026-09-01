import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('mybikelab_lang', 'en');
  });
});

const readRoadmapGeometry = (timeline) => timeline.evaluate((element) => {
  const getRect = (node) => {
    const rect = node.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    };
  };

  return {
    timeline: getRect(element),
    track: getRect(element.querySelector('.timeline-track')),
    progress: getRect(element.querySelector('.timeline-progress')),
    markers: [...element.querySelectorAll('.timeline-marker')].map(getRect),
    phases: [...element.querySelectorAll('.phase')].map(getRect),
  };
});

test('anchors desktop roadmap markers to the ends of equal segments', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('#roadmap');

  const geometry = await readRoadmapGeometry(page.locator('.timeline'));
  const markerCenters = geometry.markers.map((marker) => marker.left + marker.width / 2);
  const expectedCenters = geometry.markers.map((_, index) => (
    geometry.track.left + geometry.track.width * ((index + 1) / geometry.markers.length)
  ));

  expect(Math.abs(geometry.track.left - geometry.timeline.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.progress.right - markerCenters[0])).toBeLessThanOrEqual(1);
  markerCenters.forEach((center, index) => {
    expect(Math.abs(center - expectedCenters[index])).toBeLessThanOrEqual(1);
  });
});

test('starts the mobile roadmap spine at the first marker and follows phase ends', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('#roadmap');

  const timeline = page.locator('.timeline');
  await expect.poll(async () => {
    const geometry = await readRoadmapGeometry(timeline);
    const firstMarker = geometry.markers[0];
    return Math.abs(geometry.track.top - (firstMarker.top + firstMarker.height / 2)) <= 1;
  }).toBe(true);

  const geometry = await readRoadmapGeometry(timeline);
  const firstMarker = geometry.markers[0];
  const lastMarker = geometry.markers.at(-1);
  const markerCenters = geometry.markers.map((marker) => marker.top + marker.height / 2);

  expect(Math.abs(geometry.track.top - (firstMarker.top + firstMarker.height / 2))).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.track.bottom - (lastMarker.top + lastMarker.height / 2))).toBeLessThanOrEqual(1);
  expect(Math.abs(firstMarker.top + firstMarker.height / 2 - geometry.phases[0].bottom)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.progress.top - geometry.track.top)).toBeLessThanOrEqual(1);
  expect(geometry.progress.height / geometry.track.height).toBeCloseTo(1 / 3, 2);
  expect(markerCenters[0]).toBeLessThan(markerCenters[1]);
  expect(markerCenters[1]).toBeLessThan(markerCenters[2]);
});
