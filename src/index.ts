import { ALL_KNOWN_VERSIONS } from './version-set.js';

/**
 * Validates Minecraft version strings.
 * Supports both current and future version formats.
 *
 * @param version - The version string to validate
 * @returns true if the version is valid, false otherwise
 */
export function isValidMinecraftVersion(version: string): boolean {
  if (typeof version !== 'string' || !version.trim()) {
    return false;
  }

  // Fast Set lookup for all known versions (O(1) guaranteed)
  if (ALL_KNOWN_VERSIONS.has(version)) {
    return true;
  }

  // Fallback to patterns for future versions not in the manifest
  const futurePatterns = [
    // New year-based format (future compatibility)
    // Examples: 26.1, 26.1.1, 26.1-snapshot-1, 26.1-pre-1, 26.1-rc-1
    /^[2-5]\d\.\d{1,2}(?:\.\d{1,2})?(?:-(?:snapshot|pre|rc)-[1-9]\d{0,2})?$/
  ];

  return futurePatterns.some(pattern => pattern.test(version));
}