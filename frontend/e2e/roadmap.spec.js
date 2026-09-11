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
      width: rect.width,
      height: rect.height,
    };
  };

  return {
    timeline: getRect(element),
    track: getRect(element.querySelector('.timeline-track')),
    segments: [...element.querySelectorAll('.timeline-track-segment')].map(getRect),
    markers: [...element.querySelectorAll('.timeline-marker')].map(getRect),
    items: [...element.querySelectorAll('.roadmap-item')].map(getRect),
    cards: [...element.querySelectorAll('.roadmap-card')].map(getRect),
    groups: [...element.querySelectorAll('.roadmap-group')].map((group) => ({
      rect: getRect(group),
      heading: getRect(group.querySelector('.roadmap-group-heading')),
      substeps: [...group.querySelectorAll('.roadmap-substep')].map((substep) => ({
        rect: getRect(substep),
        card: getRect(substep.querySelector('.roadmap-card')),
      })),
    })),
    milestoneCards: [...element.querySelectorAll('.roadmap-milestone .roadmap-card')].map(getRect),
    substeps: [...element.querySelectorAll('.roadmap-substep')].map((item) => ({
      rect: getRect(item),
      connectorWidth: Number.parseFloat(getComputedStyle(item, '::before').width),
    })),
  };
});

const assertVerticalRoadmap = async (page) => {
  const timeline = page.locator('.timeline');
  await expect(timeline.locator('.timeline-marker')).toHaveCount(10);
  await expect(timeline.locator('.roadmap-group')).toHaveCount(2);
  await expect(timeline.locator('.roadmap-item[data-roadmap-state="complete"]')).toHaveCount(1);
  await expect(timeline.locator('.roadmap-item[data-roadmap-state="active"]')).toHaveCount(1);
  await expect(timeline.locator('.roadmap-item[data-roadmap-state="future"]')).toHaveCount(8);
  await expect(timeline.locator('.timeline-progress')).toHaveCount(0);

  await expect.poll(async () => (await readRoadmapGeometry(timeline)).track.height).toBeGreaterThan(0);
  const geometry = await readRoadmapGeometry(timeline);
  const markerCenters = geometry.markers.map((marker) => ({
    x: marker.left + marker.width / 2,
    y: marker.top + marker.height / 2,
  }));
  const trackCenter = geometry.track.left + geometry.track.width / 2;

  expect(geometry.track.width).toBeLessThanOrEqual(3);
  expect(geometry.track.height).toBeGreaterThan(geometry.track.width);
  geometry.groups.forEach(({ rect, heading, substeps }) => {
    expect(rect.left).toBeGreaterThan(geometry.track.left + geometry.track.width);
    expect(heading.left).toBeGreaterThan(rect.left);
    substeps.forEach(({ card }) => {
      expect(card.left).toBeGreaterThan(heading.left + 10);
      expect(card.left + card.width).toBeLessThanOrEqual(rect.left + rect.width);
    });
  });
  const firstCardLeft = geometry.milestoneCards[0].left;
  geometry.milestoneCards.forEach((card) => {
    expect(Math.abs(card.left - firstCardLeft)).toBeLessThanOrEqual(1);
  });
  markerCenters.forEach((center) => {
    expect(Math.abs(center.x - trackCenter)).toBeLessThanOrEqual(1);
  });
  markerCenters.slice(1).forEach((center, index) => {
    expect(center.y).toBeGreaterThan(markerCenters[index].y);
  });
  expect(geometry.segments[1].height).toBeGreaterThan(0);
  expect(geometry.segments[0].height).toBeGreaterThan(0);
  geometry.substeps.forEach(({ connectorWidth }) => {
    expect(connectorWidth).toBeGreaterThan(0);
  });
};

const assertSemanticTimelineStyles = async (page) => {
  const styles = await page.locator('.timeline').evaluate((timeline) => {
    const completeMarker = timeline.querySelector('.timeline-marker-complete');
    const activeMarker = timeline.querySelector('.timeline-marker-active');
    const completeTrack = timeline.querySelector('.timeline-track-complete');
    const activeTrack = timeline.querySelector('.timeline-track-active');
    const groupHeading = timeline.querySelector('.roadmap-group-heading');

    return {
      completeMarkerBackground: getComputedStyle(completeMarker).backgroundColor,
      completeMarkerWidth: getComputedStyle(completeMarker).width,
      completeMarkerHeight: getComputedStyle(completeMarker).height,
      completeMarkerBorderRadius: getComputedStyle(completeMarker).borderRadius,
      completeMarkerShadow: getComputedStyle(completeMarker).boxShadow,
      activeMarkerWidth: getComputedStyle(activeMarker).width,
      activeMarkerHeight: getComputedStyle(activeMarker).height,
      activeMarkerBorderRadius: getComputedStyle(activeMarker).borderRadius,
      activeMarkerShadow: getComputedStyle(activeMarker).boxShadow,
      completeTrackBackground: getComputedStyle(completeTrack).backgroundColor,
      activeTrackBackgroundImage: getComputedStyle(activeTrack).backgroundImage,
      groupHeadingBorderLeftWidth: getComputedStyle(groupHeading).borderLeftWidth,
    };
  });

  expect(styles.completeMarkerBackground).not.toBe('rgb(255, 255, 255)');
  expect(styles.completeMarkerWidth).toBe(styles.activeMarkerWidth);
  expect(styles.completeMarkerHeight).toBe(styles.activeMarkerHeight);
  expect(styles.completeMarkerBorderRadius).toBe(styles.activeMarkerBorderRadius);
  expect(styles.completeMarkerShadow).not.toBe('none');
  expect(styles.activeMarkerShadow).not.toBe('none');
  expect(styles.completeTrackBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(styles.activeTrackBackgroundImage).toContain('gradient');
  expect(styles.groupHeadingBorderLeftWidth).toBe('0px');
};

test('renders one semantic vertical timeline at desktop and mobile widths', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('#roadmap');
    await assertVerticalRoadmap(page);
    await assertSemanticTimelineStyles(page);
  }
});

test('keeps the validated content, anchor, themes and French translation', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('#roadmap');

  await expect(page.locator('#roadmap')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A clearer path forward' })).toBeVisible();
  await expect(page.getByText('Keep data fresh')).toBeVisible();
  await expect(page.getByText('Full bike configurator')).toBeVisible();

  const bodyText = (await page.locator('body').innerText()).toLowerCase();
  expect(bodyText).not.toContain('three phases');
  expect(bodyText).not.toContain('phases planned');
  expect(bodyText).not.toContain('1 / 9');
  expect(await page.locator('.roadmap-section').evaluate((section) => section.id)).toBe('roadmap');

  await page.getByRole('group', { name: 'Language' }).getByRole('button', { name: 'FR' }).click();
  await expect(page.getByRole('heading', { name: 'Une trajectoire plus claire' })).toBeVisible();
  await expect(page.getByText('Gagner en fraîcheur')).toBeVisible();
  await assertVerticalRoadmap(page);

  const themeGroup = page.getByRole('group', { name: 'Thème' });
  for (const theme of ['light', 'cream', 'dark']) {
    await themeGroup.locator(`[data-theme-choice="${theme}"]`).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('.timeline')).toBeVisible();
  }
});
