# Minecraft Version Validator

A TypeScript library to validate Minecraft version strings.

## Installation

```bash
npm install minecraft-version-validator
```

## Usage

```typescript
import { isValidMinecraftVersion } from 'minecraft-version-validator';

console.log(isValidMinecraftVersion('1.21.10'));          // true
console.log(isValidMinecraftVersion('1.21.11-pre5'));     // true
console.log(isValidMinecraftVersion('25w46a'));           // true
console.log(isValidMinecraftVersion('25w14craftmine'));   // true
console.log(isValidMinecraftVersion('26.1'));             // true
console.log(isValidMinecraftVersion('invalid'));          // false
```

## Supported Formats

- **Year-based format**: `26.1`, `26.1.1`, `26.1-snapshot-1`, `26.1-pre-1`, `26.1-rc-1`
- **Releases**: `1.21.10`, `1.21.9`
- **Pre-releases**: `1.21.11-pre5`, `1.21.9-pre4`
- **Release candidates**: `1.21.10-rc1`, `1.21.9-rc1`
- **Snapshots**: `25w46a`, `25w36b`, `25w14craftmine`
- **Legacy**: `a1.2.3`, `b1.8.1`, `rd-20090515`