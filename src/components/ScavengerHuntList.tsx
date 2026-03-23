import type { ScavengerItem, ScavengerProgress } from "../types";
import { ProgressMeter } from "./ProgressMeter";

interface ScavengerHuntListProps {
  items: ScavengerItem[];
  progress: ScavengerProgress;
  onToggle: (itemId: number) => void;
}

export function ScavengerHuntList({
  items,
  progress,
  onToggle,
}: ScavengerHuntListProps) {
  return (
    <div className="space-y-4">
      <ProgressMeter
        completedCount={progress.completedCount}
        totalCount={progress.totalCount}
        percent={progress.percent}
      />

      {progress.isComplete && (
        <div className="chalk-pop rounded-xl border border-bingo/45 bg-bingo/18 px-4 py-3 text-center text-sm font-bold uppercase tracking-wider text-bingo sm:text-base">
          Scavenger Hunt complete! Every clue has a check mark.
        </div>
      )}

      <ul
        className="scavenger-list reveal reveal-delay-2"
        aria-label="Scavenger checklist"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className={`scavenger-row${item.isChecked ? " scavenger-row-checked" : ""}`}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => onToggle(item.id)}
                className="scavenger-checkbox"
                aria-label={item.text}
              />
              <span className="text-sm leading-6 text-chalk sm:text-base">
                {item.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
