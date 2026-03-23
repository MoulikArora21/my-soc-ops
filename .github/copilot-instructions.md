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
