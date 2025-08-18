# Copilot Instructions for AI Agents

## Project Overview
This is a TypeScript project using Node.js, with configuration files at the root. The project currently has minimal structure and dependencies, focusing on TypeScript compilation and basic Node.js setup.

## Key Files
- `package.json`: Defines project metadata, dependencies, and scripts. Only a placeholder test script is present.
- `tsconfig.json`: Configures TypeScript with strict type checking, ESNext target, NodeNext module resolution, and React JSX support.

## Build & Development Workflow
- **TypeScript Compilation**: Use `npx tsc` to compile TypeScript files. The output directory and root directory are not set, so defaults apply unless changed in `tsconfig.json`.
- **Testing**: No test framework is configured. The `test` script in `package.json` is a placeholder and will always fail. Add a test runner (e.g., Jest, Mocha) and update the script for real tests.
- **Node.js Execution**: The main entry is set to `index.js`, but this file does not exist. Create it or update `package.json` as needed.

## TypeScript Conventions
- **Strict Type Checking**: The project enforces strict type rules (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- **Module System**: Uses `nodenext` for module resolution. Prefer ES module syntax (`import/export`) but CommonJS is also supported.
- **JSX Support**: Configured for React JSX (`jsx: react-jsx`).
- **Declaration Files**: TypeScript will emit declaration files (`declaration: true`).

## Patterns & Recommendations
- Place source files in a `src/` directory for better organization. Update `tsconfig.json` with `rootDir` and `outDir` if you do so.
- Install `@types/node` for Node.js type definitions if using Node APIs: `npm install -D @types/node`.
- Add a test framework and update the `test` script for meaningful test coverage.
- If using React, ensure dependencies are installed and source files are placed appropriately.

## Example Commands
- Compile TypeScript: `npx tsc`
- Install Node types: `npm install -D @types/node`
- Add Jest: `npm install --save-dev jest ts-jest @types/jest`

## Integration Points
- No external services or APIs are currently integrated.
- All configuration is local and project structure is minimal.

## Next Steps
- Add a `src/` directory and move code there for clarity.
- Set up a test framework and update scripts.
- Document any new conventions or workflows as the project evolves.

---
_If any section is unclear or missing important details, please provide feedback so this guide can be improved._
