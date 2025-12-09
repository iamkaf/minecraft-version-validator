# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run build` - Compile TypeScript to JavaScript in `dist/`
- `npm test` - Run all tests using Vitest
- `npm run dev` - Run tests in watch mode for development
- `npm run generate-versions` - Regenerate the version Set from Minecraft manifest data
- `npm run prepack` - Build before packaging (runs automatically)

### Testing
- Run all tests: `npm test`
- Watch mode: `npm run dev`
- Test specific patterns: `npm test -- --run "pattern"`

## Architecture Overview

This is a TypeScript library that validates Minecraft version strings using a **hybrid validation strategy**:

1. **Pre-computed Set Lookup** - O(1) validation for known versions stored in `src/version-set.ts`
2. **Regex Pattern Matching** - Future-proof validation for upcoming version formats

### Core Components

**`src/index.ts`** - Main entry point exposing `isValidMinecraftVersion(version: string): boolean`
- First checks if version exists in the pre-computed Set (fast path)
- Falls back to regex patterns for unknown versions
- Handles input validation and edge cases

**`src/version-set.ts`** - Auto-generated Set containing all known Minecraft versions
- Contains ~860 versions from classic (`c0.30_01c`) to modern (`1.21.11-pre5`)
- Generated from official Minecraft version manifest
- DO NOT edit manually - use `npm run generate-versions`

**`scripts/generate-version-set.ts`** - Utility to refresh version data
- Fetches from `test/version_manifest_copy.json`
- Creates TypeScript Set with all version IDs
- Updates timestamp in generated code

### Version Format Support

The library validates comprehensive Minecraft version formats:
- Modern releases: `1.21.10`, `1.21.9`
- Pre-releases: `1.21.11-pre5`, `1.21.9-pre4`
- Release candidates: `1.21.10-rc1`
- Snapshots: `25w46a`, `25w14craftmine`
- Legacy formats: `a1.2.6`, `b1.8.1`, `rd-20090515`
- Future year-based: `26.1`, `26.1-snapshot-1`, `26.1-pre-1`

### Key Patterns

**Future-proof regex**: `/^[2-5]\d\.\d{1,2}(?:\.\d{1,2})?(?:-(?:snapshot|pre|rc)-[1-9]\d{0,2})?$/`
- Supports year-based formats through 59xx
- Handles optional hotfix versions and pre-release suffixes

**Performance optimization**: Set lookup provides O(1) validation for known versions, ensuring fast validation for the common case.

## Build and CI/CD

**TypeScript Configuration**: Targets ES2022 with strict mode enabled, using modern module resolution.

**Testing**: Uses Vitest with comprehensive coverage including:
- All supported version formats with real examples
- 200+ invalid version formats for proper rejection
- Type safety validation for non-string inputs

**CI/CD**:
- Tests on Node.js 18.x, 20.x, 22.x, and 24.x
- Automated npm publishing with manual workflow trigger
- Version bumping and Git tagging in publish pipeline

## Development Notes

- The version Set is auto-generated - never edit `src/version-set.ts` manually
- When adding new version support, update the regex patterns in `src/index.ts`
- Test coverage is comprehensive - new formats should include both valid and invalid test cases
- The library has zero runtime dependencies for minimal bundle size