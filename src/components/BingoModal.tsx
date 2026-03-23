interface BingoModalProps {
  onDismiss: () => void;
}

export function BingoModal({ onDismiss }: BingoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/62 p-4 backdrop-blur-[2px]">
      <div className="chalk-pop w-full max-w-sm rounded-2xl border-2 border-white/22 bg-board/95 px-6 py-7 text-center shadow-2xl">
        <p className="chalk-hand text-4xl text-accent">Classroom Cheers</p>
        <h2 className="chalk-heading mt-2 text-4xl text-bingo">BINGO</h2>
        <p className="chalk-subtext mt-3 text-base">You filled a full line before the bell. Keep mingling for bonus lines.</p>

        <button
          onClick={onDismiss}
          className="chalk-button mt-6 w-full rounded-xl px-6 py-3 text-lg font-extrabold"
        >
          Keep Playing
        </button>
      </div>
    </div>
  );
}
