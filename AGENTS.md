**AGENTS.md**

- **Development server**: `npm run start` (or `yarn start`) launches the Expo dev server.
- **Platform shortcuts**:
  - Android: `npm run android`
  - iOS: `npm run ios`
  - Web: `npm run web`
- **TypeScript path aliases** (configured in `tsconfig.json`):
  - `@/*` → `src/*`
  - `@design/*` → `src/design/*`
  - `@components/*` → `src/components/*`
  - `@data/*` → `src/data/*`
  - `@store/*` → `src/store/*`
  - `@utils/*` → `src/utils/*`
  - `@types/*` → `src/types/*`
- **Expo Router**: Files under `src/app/` map directly to routes. The filename (e.g., `index.tsx`, `vida/index.tsx`) becomes the URL path.
- **Do not commit `.expo/`**: It contains local device/dev‑server metadata and is already ignored via `.gitignore`.
- **Building**: Use Expo CLI (`expo build:<platform>` or `eas build`) after ensuring the dev server runs cleanly.
- **Running tests**: No test suite is defined; add jest/mocha config if needed.
- **Lint/format**: No explicit lint/format scripts; rely on IDE or add ESLint/Prettier as desired.
