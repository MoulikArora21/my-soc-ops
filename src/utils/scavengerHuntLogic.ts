import { questions } from '../data/questions';
import type { ScavengerItem, ScavengerProgress } from '../types';

export function generateScavengerItems(): ScavengerItem[] {
  return questions.map((text, index) => ({
    id: index,
    text,
    isChecked: false,
  }));
}

export function toggleScavengerItem(items: ScavengerItem[], itemId: number): ScavengerItem[] {
  return items.map((item) =>
    item.id === itemId
      ? { ...item, isChecked: !item.isChecked }
      : item
  );
}

export function clearScavengerItems(items: ScavengerItem[]): ScavengerItem[] {
  return items.map((item) => ({ ...item, isChecked: false }));
}

export function calculateScavengerProgress(items: ScavengerItem[]): ScavengerProgress {
  const totalCount = items.length;
  const completedCount = items.filter((item) => item.isChecked).length;
  const percent = totalCount === 0
    ? 0
    : Math.round((completedCount / totalCount) * 100);

  return {
    completedCount,
    totalCount,
    percent,
    isComplete: totalCount > 0 && completedCount === totalCount,
  };
}
