# AGENTS.md

Guidance for agents working in the CardWise repository.

## Project Shape

CardWise is an npm workspace monorepo:

- `apps/mobile` - Expo React Native app, TypeScript, SDK 54.
- `apps/api` - Express API, TypeScript, Prisma, PostgreSQL.
- `packages/shared` - shared TypeScript business logic, including recommendation logic.
- `docs/specs` - project specs for behavior changes.

## Commands

Run commands from the repository root unless noted.

- Install: `npm install`
- Build all: `npm run build`
- Test default suite: `npm run test`
- Test shared package: `npm run test -w @cardwise/shared`
- Test mobile package: `npm run test -w @cardwise/mobile`
- Typecheck mobile: `npm run typecheck -w @cardwise/mobile`
- Build API: `npm run build -w @cardwise/api`
- Build shared: `npm run build -w @cardwise/shared`
- Start API: `npm run dev:api`
- Start mobile: `npm run dev:mobile -- --tunnel --clear`
- Prisma generate: `npm run db:generate`
- Prisma migrate: `npm run db:migrate`
- Seed database: `npm run db:seed`

There is currently no lint script. Do not claim lint was run unless a lint command is added.

## Development Workflow

- Read the relevant package files before editing; keep changes scoped to the requested behavior.
- For behavior changes, create or update a spec under `docs/specs` before implementation.
- Use test-driven development for bug fixes and new logic: write a failing test, make it pass, then refactor.
- Keep business logic outside React Native screens where practical. Prefer small pure functions in `services` or `packages/shared`.
- Follow existing dependency boundaries: shared logic belongs in `packages/shared`; mobile UI state and Expo integrations stay in `apps/mobile`; API/database concerns stay in `apps/api`.
- Do not change Prisma schema, add dependencies, or alter native Expo modules unless the task requires it.
- Preserve Expo Go compatibility unless the task explicitly targets a development build.

## Testing Requirements

- Recommendation engine changes require unit tests in `packages/shared`.
- Mobile behavior that can be expressed as pure logic should have Vitest tests in `apps/mobile/src/**/*.test.ts`.
- API changes should at minimum pass `npm run build -w @cardwise/api`; add focused tests before introducing risky backend logic.
- Before shipping multi-package changes, run `npm run build`.
- For iOS/mobile runtime issues, verify with Expo after tests/typecheck when feasible.

## Code Review Checklist

Before finalizing a change, review it across these checks:

- Correctness: matches the spec or request, handles empty/error/boundary states, preserves backend validation.
- Tests: new behavior has a focused test, tests assert behavior rather than implementation details, no skipped tests.
- Readability: names are clear, control flow is simple, abstractions are justified by current use.
- Architecture: logic lives in the right package, no unnecessary coupling, no unrelated refactors.
- Security: no secrets committed, user input is validated at API boundaries, raw server errors are not exposed in UI.
- Performance: no unbounded API/database work, no obvious N+1 queries, avoid unnecessary mobile re-renders.
- Verification: list the exact commands run and any commands that could not be run.

## Git Hygiene

- Never revert user changes unless explicitly asked.
- Keep unrelated work out of the diff.
- Check `git status --short` before and after edits.
- Prefer small commits with imperative messages when asked to commit.
