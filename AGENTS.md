# AGENTS.md

## Purpose

This file is the enforcement policy for AI agents working in this repository.

If a user request conflicts with this policy, stop and ask for clarification before making changes.

## Rule Priority (Highest to Lowest)

1. Direct user instruction for the current task.
2. This `AGENTS.md` policy.
3. Existing codebase patterns already present in the repo.
4. Personal or default agent preferences.

## Repository Structure (Source of Truth)

Agents must preserve this layout and place new files in the correct area.

```text
billbot-frontend/
  app.json
  babel.config.js
  index.ts
  package.json
  tsconfig.json
  android/
  ios/
  src/
    App.tsx
    core/
      assets/
      common/
        constants/
        error/
        interface/
        network/
        utils/
    features/
      auth/
        hooks/
      user/
```

## Placement Rules

### Root Files

- Keep framework and tool config at root only (`app.json`, `babel.config.js`, `tsconfig.json`, `eslint.config.js`, `package.json`).
- Do not add feature business logic in root.

### `src/`

- `src/App.tsx` remains the main app composition entry in source code.
- Put reusable platform-agnostic building blocks in `src/core/`.
- Put domain-specific logic in `src/features/<feature-name>/`.

### `src/core/`

- `core/assets/`: static assets shared across features.
- `core/common/constants/`: global constants and theme/environment constants.
- `core/common/network/`: HTTP client setup and network helpers.
- `core/common/utils/`: generic utilities.
- `core/common/interface/`: shared interfaces/types used across multiple features.
- `core/common/error/`: app-level error helpers.

### `src/features/`

Each feature must stay self-contained.

For a feature `<x>`, keep files in this pattern unless the user asks otherwise:

- `<x>.dto.ts`
- `<x>.interface.ts`
- `<x>.mapper.ts`
- `<x>.service.ts`
- `<x>.state.ts`
- `hooks/use-*.ts`

Do not move files from one feature to another without explicit user approval.

## Naming Conventions

- Feature folders: lowercase, singular/plural based on existing pattern (currently `auth`, `user`).
- Hook files: `use-<action>.ts` with kebab-case file names.
- Feature support files: `<feature>.<role>.ts` (`auth.service.ts`, `user.state.ts`).
- Keep file names consistent with the existing feature naming style.

## Import Rules

- Prefer alias-based imports from `@/` for cross-folder imports (`@` maps to `src` in both `tsconfig.json` and `babel.config.js`).
- Use relative imports only for same-folder or direct child-folder files.
- Avoid deep relative paths like `../../../` when `@/` can be used.

## Boundary Rules

- `core/` must not depend on `features/`.
- A feature may depend on `core/`.
- A feature should not directly depend on another feature unless the user explicitly asks for cross-feature coupling.
- Keep native folders (`ios/`, `android/`) isolated from feature-level TypeScript logic.

## Protected and Generated Areas

Treat these as restricted unless the task explicitly targets them:

- `android/build/`, `android/app/build/`
- `ios/build/`, `ios/Pods/`
- `.expo/`, `node_modules/`

Do not manually edit generated artifacts.

## App Configuration Safety

- `app.json` is sensitive. Update paths and identifiers only when requested.
- If changing asset paths in `app.json`, verify target files exist before editing references.
- Keep `ios.bundleIdentifier` and `android.package` aligned with explicit user requirements.

## Pre-Change Checklist (Agents Must Follow)

Before editing:

1. Identify the smallest valid scope of files.
2. Confirm target folder matches rules above.
3. Confirm naming pattern for new files.
4. Confirm imports will follow `@/` alias policy.

## Post-Change Checklist (Agents Must Follow)

After editing code files:

1. Run lint for touched files or run repo lint if scoped lint is unavailable.
2. Run formatting checks for touched files.
3. Run type checks when TypeScript files are changed.
4. Report what changed and why, with exact file paths.

Suggested commands:

```bash
npm run lint
npm run format:check
npx tsc --noEmit
```

## Forbidden Actions

- Do not create new top-level architecture folders without explicit approval.
- Do not relocate existing feature files for style reasons only.
- Do not introduce a new naming convention when one already exists.
- Do not edit native/generated directories unless the task is explicitly native/build related.

## Change Request Protocol

If the task requires violating this policy, the agent must:

1. Pause implementation.
2. State which rule would be violated.
3. Ask for explicit approval and the intended new structure.
4. Proceed only after user confirmation.

---

Following this policy is mandatory for all AI-assisted edits in this repository.
