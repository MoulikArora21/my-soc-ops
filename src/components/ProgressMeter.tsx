interface ProgressMeterProps {
  completedCount: number;
  totalCount: number;
  percent: number;
}

export function ProgressMeter({
  completedCount,
  totalCount,
  percent,
}: ProgressMeterProps) {
  return (
    <section
      className="progress-shell reveal reveal-delay-1"
      aria-label="Scavenger progress"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="chalk-hand text-2xl text-accent sm:text-3xl">
          Scavenger Hunt Progress
        </p>
        <span className="chalk-chip px-3 py-1 text-xs font-bold tracking-wide sm:text-sm">
          {completedCount}/{totalCount}
        </span>
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full border border-white/18 bg-black/20">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={`${percent}% complete`}
        />
      </div>

      <p className="mt-2 text-sm font-bold tracking-wide text-chalk-soft">
        {percent}% complete
      </p>
    </section>
  );
}
