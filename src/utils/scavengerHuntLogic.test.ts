import { describe, it, expect } from 'vitest';
import {
  generateScavengerItems,
  toggleScavengerItem,
  clearScavengerItems,
  calculateScavengerProgress,
} from './scavengerHuntLogic';

describe('scavengerHuntLogic', () => {
  describe('generateScavengerItems', () => {
    it('creates one checklist item per question', () => {
      const items = generateScavengerItems();
      expect(items.length).toBe(24);
      expect(items.every((item) => item.isChecked === false)).toBe(true);
    });

    it('creates stable ids in source order', () => {
      const items = generateScavengerItems();
      expect(items.map((item) => item.id)).toEqual(Array.from({ length: 24 }, (_, i) => i));
    });
  });

  describe('toggleScavengerItem', () => {
    it('toggles target item only', () => {
      const items = generateScavengerItems();
      const toggled = toggleScavengerItem(items, 3);

      expect(toggled[3].isChecked).toBe(true);
      expect(toggled[4].isChecked).toBe(false);
    });

    it('returns a new array', () => {
      const items = generateScavengerItems();
      const toggled = toggleScavengerItem(items, 1);
      expect(toggled).not.toBe(items);
    });
  });

  describe('clearScavengerItems', () => {
    it('clears all checked state and keeps order', () => {
      const items = generateScavengerItems();
      const toggled = toggleScavengerItem(toggleScavengerItem(items, 0), 8);
      const cleared = clearScavengerItems(toggled);

      expect(cleared.every((item) => item.isChecked === false)).toBe(true);
      expect(cleared.map((item) => item.id)).toEqual(toggled.map((item) => item.id));
    });
  });

  describe('calculateScavengerProgress', () => {
    it('returns zero progress for untouched list', () => {
      const progress = calculateScavengerProgress(generateScavengerItems());
      expect(progress.completedCount).toBe(0);
      expect(progress.totalCount).toBe(24);
      expect(progress.percent).toBe(0);
      expect(progress.isComplete).toBe(false);
    });

    it('returns 100 percent and complete when all checked', () => {
      const allChecked = generateScavengerItems().map((item) => ({ ...item, isChecked: true }));
      const progress = calculateScavengerProgress(allChecked);

      expect(progress.completedCount).toBe(24);
      expect(progress.totalCount).toBe(24);
      expect(progress.percent).toBe(100);
      expect(progress.isComplete).toBe(true);
    });
  });
});
