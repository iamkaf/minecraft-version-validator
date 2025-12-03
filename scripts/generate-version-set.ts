import fs from 'fs';
import path from 'path';

interface Version {
  id: string;
  type: string;
  url: string;
  time: string;
  releaseTime: string;
  sha1: string;
  complianceLevel: number;
}

interface ManifestData {
  latest: {
    release: string;
    snapshot: string;
  };
  versions: Version[];
}

/**
 * Generates a Set containing all known Minecraft versions from the manifest
 * Usage: npm run generate-versions
 */

const manifestPath = path.join(process.cwd(), 'test', 'version_manifest_copy.json');
const outputPath = path.join(process.cwd(), 'src', 'version-set.ts');

try {
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as ManifestData;
  const allVersions = manifestData.versions.map(v => v.id);

  const content = `/**
 * Auto-generated Set of all known Minecraft versions
 * Generated with: npm run generate-versions
 * Last updated: ${new Date().toISOString()}
 */
export const ALL_KNOWN_VERSIONS = new Set([
${allVersions.map(v => `  "${v}"`).join(',\n')}
]);
`;

  fs.writeFileSync(outputPath, content, 'utf8');

  console.log(`✅ Generated version Set with ${allVersions.length} versions`);
  console.log(`📁 Output: ${outputPath}`);
} catch (error) {
  console.error('❌ Error generating version Set:', (error as Error).message);
  process.exit(1);
}