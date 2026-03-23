# Project Guidelines

## Build And Test
- Required runtime: Node.js 22+
- Install dependencies: npm install
- Start dev server: npm run dev
- Lint: npm run lint
- Build: npm run build
- Test: npm run test
- Preferred VS Code task for local development: npm: dev

## Architecture
- App bootstrap: src/main.tsx -> src/App.tsx
- Screen flow is state-driven:
  - start screen: src/components/StartScreen.tsx
  - game screen: src/components/GameScreen.tsx
  - bingo modal: src/components/BingoModal.tsx
- State orchestration lives in src/hooks/useBingoGame.ts (game state, persistence, interactions).
- Pure game logic lives in src/utils/bingoLogic.ts and should remain UI-agnostic.
- Domain contracts live in src/types/index.ts.

## Conventions
- Keep game rules and board transformations in pure utility functions; avoid embedding logic in presentational components.
- Preserve localStorage compatibility in src/hooks/useBingoGame.ts by updating storage versioning and validation together.
- Maintain strict TypeScript typings for domain models and hook return contracts.
- Use Tailwind CSS v4 patterns used by this workspace; avoid introducing tailwind.config.js unless explicitly needed.

## Design Guide
- Current visual direction is Chalkboard Classroom: slate-green board surfaces, warm wood accents, chalk-like text treatment, and classroom-themed copy.
- Keep design tokens centralized in src/index.css using Tailwind v4 `@theme`; avoid hardcoding repeated colors, typography, and spacing values in component files.
- Typography roles should remain deliberate: display for major headings, highly readable body text for gameplay instructions, and a handwritten accent used sparingly for emphasis.
- Motion should be bold but intentional (screen reveal, board entrance, bingo celebration), with reduced-motion support preserved.
- Preserve clear state contrast between unmarked, marked, winning, and free-space squares so gameplay remains scannable on mobile and desktop.
- Prioritize responsive board usability: maintain comfortable tap targets, readable square text, and no clipping at narrow widths.
- Keep decorative effects secondary to clarity; interaction controls and bingo status feedback must remain immediately legible.

## Customization References
- Frontend design direction: .github/instructions/frontend-design.instructions.md
- Tailwind v4 guidance: .github/instructions/tailwind-4.instructions.md
- Setup workflow prompt: .github/prompts/setup.prompt.md
- Exploration prompt: .github/prompts/cloud-explore.prompt.md
- Specialized agents: .github/agents/

## Additional Docs
- Project overview and run basics: README.md
- Lab workflow and task map: workshop/GUIDE.md
- Contribution policy: CONTRIBUTING.md
