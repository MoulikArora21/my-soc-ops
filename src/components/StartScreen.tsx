import { useState } from 'react';
import type { PlayerProfile } from '../types';

interface StartScreenProps {
  onStart: (profile: PlayerProfile) => void;
}

const VIBES: { id: string; emoji: string; label: string }[] = [
  { id: 'social',    emoji: '🦋', label: 'Social Butterfly' },
  { id: 'hype',      emoji: '🔥', label: 'Hype Squad' },
  { id: 'sharpshot', emoji: '🎯', label: 'Sharp Shooter' },
  { id: 'chill',     emoji: '😎', label: 'Chill Vibes' },
];

export function StartScreen({ onStart }: StartScreenProps) {
  const [nickname, setNickname] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  function handleStart() {
    onStart({ nickname: nickname.trim(), vibe: selectedVibe });
  }

  // Build personalised CTA label
  const name = nickname.trim();
  const vibeItem = VIBES.find((v) => v.id === selectedVibe);
  let ctaLabel = 'Ring The Bell And Start';
  if (name && vibeItem) {
    ctaLabel = `Ring The Bell, ${name} · ${vibeItem.emoji}`;
  } else if (name) {
    ctaLabel = `Ring The Bell, ${name}!`;
  } else if (vibeItem) {
    ctaLabel = `Ring The Bell · ${vibeItem.emoji} ${vibeItem.label}`;
  }

  return (
    <div className="page-shell">
      <section className="chalkboard-panel px-5 py-7 sm:px-8 sm:py-10 board-reveal">
        <div className="mx-auto max-w-2xl text-center">
          <p className="chalk-hand reveal text-2xl text-accent sm:text-3xl">Homeroom Mixer</p>
          <h1 className="chalk-heading reveal reveal-delay-1 mt-3 text-5xl text-chalk sm:text-6xl">
            Soc Ops
          </h1>
          <p className="chalk-subtext reveal reveal-delay-2 mx-auto mt-4 max-w-xl text-base sm:text-lg">
            Roll call is open. Find classmates who match each clue and mark your board in chalk.
          </p>

          {/* Onboarding: optional nickname */}
          <div className="reveal reveal-delay-2 mt-6 flex justify-center">
            <label className="sr-only" htmlFor="nickname-input">
              Your nickname (optional)
            </label>
            <input
              id="nickname-input"
              type="text"
              className="onboarding-input"
              placeholder="Your nickname (optional)"
              maxLength={24}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          {/* Onboarding: vibe chip selector */}
          <div
            className="reveal reveal-delay-3 mt-4"
            role="group"
            aria-labelledby="vibe-label"
          >
            <p id="vibe-label" className="chalk-hand mb-3 text-base text-chalk-soft">Pick your vibe</p>
            <div className="flex flex-wrap justify-center gap-2">
              {VIBES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVibe((prev) => (prev === v.id ? null : v.id))}
                  aria-pressed={selectedVibe === v.id}
                  className={`vibe-chip${selectedVibe === v.id ? ' vibe-chip-active' : ''}`}
                >
                  <span aria-hidden="true">{v.emoji}</span> {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Class Rules */}
          <div className="reveal reveal-delay-4 mt-6 rounded-2xl border border-white/15 bg-white/7 p-5 text-left shadow-lg sm:p-6">
            <h2 className="chalk-heading text-xl text-chalk sm:text-2xl">Class Rules</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-chalk-soft sm:text-base">
              <li>Ask around and find someone that fits each square.</li>
              <li>Tap each match to chalk it on your board.</li>
              <li>Land 5 in a row to call out BINGO.</li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="chalk-button reveal reveal-delay-5 mt-8 w-full rounded-xl px-8 py-4 text-lg font-extrabold sm:mt-10 sm:text-xl"
          >
            {ctaLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
