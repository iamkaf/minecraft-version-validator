import { describe, it, expect } from 'vitest';
import { isValidMinecraftVersion } from '../src/index';
import manifestData from './version_manifest_copy.json';

describe('isValidMinecraftVersion', () => {
  describe('Modern release versions', () => {
    it('should validate standard release versions', () => {
      expect(isValidMinecraftVersion('1.21.10')).toBe(true);
      expect(isValidMinecraftVersion('1.21.9')).toBe(true);
      expect(isValidMinecraftVersion('1.20.6')).toBe(true);
      expect(isValidMinecraftVersion('1.19.4')).toBe(true);
    });

    it('should validate pre-release versions', () => {
      expect(isValidMinecraftVersion('1.21.11-pre5')).toBe(true);
      expect(isValidMinecraftVersion('1.21.11-pre1')).toBe(true);
      expect(isValidMinecraftVersion('1.21.9-pre4')).toBe(true);
      expect(isValidMinecraftVersion('1.21.9-pre1')).toBe(true);
    });

    it('should validate release candidate versions', () => {
      expect(isValidMinecraftVersion('1.21.10-rc1')).toBe(true);
      expect(isValidMinecraftVersion('1.21.9-rc1')).toBe(true);
      expect(isValidMinecraftVersion('1.21-rc1')).toBe(true);
    });
  });

  describe('Modern snapshot versions', () => {
    it('should validate regular snapshot versions', () => {
      expect(isValidMinecraftVersion('25w46a')).toBe(true);
      expect(isValidMinecraftVersion('25w45a')).toBe(true);
      expect(isValidMinecraftVersion('25w36b')).toBe(true);
      expect(isValidMinecraftVersion('23w13a')).toBe(true);
    });

    it('should validate special snapshot formats', () => {
      expect(isValidMinecraftVersion('25w14craftmine')).toBe(true);
      expect(isValidMinecraftVersion('23w13a_or_b')).toBe(true);
    });
  });

  describe('Future year-based format', () => {
    it('should validate basic year format', () => {
      expect(isValidMinecraftVersion('26.1')).toBe(true);
      expect(isValidMinecraftVersion('25.2')).toBe(true);
      expect(isValidMinecraftVersion('24.12')).toBe(true);
    });

    it('should validate year format with hotfix', () => {
      expect(isValidMinecraftVersion('26.1.1')).toBe(true);
      expect(isValidMinecraftVersion('26.1.2')).toBe(true);
    });

    it('should validate year format with snapshot', () => {
      expect(isValidMinecraftVersion('26.1-snapshot-1')).toBe(true);
      expect(isValidMinecraftVersion('26.1-snapshot-2')).toBe(true);
    });

    it('should validate year format with pre-release', () => {
      expect(isValidMinecraftVersion('26.1-pre-1')).toBe(true);
      expect(isValidMinecraftVersion('26.1-pre-2')).toBe(true);
    });

    it('should validate year format with release candidate', () => {
      expect(isValidMinecraftVersion('26.1-rc-1')).toBe(true);
      expect(isValidMinecraftVersion('26.1-rc-2')).toBe(true);
    });
  });

  describe('Legacy alpha versions', () => {
    it('should validate alpha versions', () => {
      expect(isValidMinecraftVersion('a1.2.6')).toBe(true);
      expect(isValidMinecraftVersion('a1.2.5')).toBe(true);
      expect(isValidMinecraftVersion('a1.2.4_01')).toBe(true);
      expect(isValidMinecraftVersion('a1.2.3')).toBe(true);
      expect(isValidMinecraftVersion('a1.2.2b')).toBe(true);
      expect(isValidMinecraftVersion('a1.2.2a')).toBe(true);
      expect(isValidMinecraftVersion('a1.2.1_01')).toBe(true);
    });
  });

  describe('Legacy beta versions', () => {
    it('should validate beta versions', () => {
      expect(isValidMinecraftVersion('b1.8.1')).toBe(true);
      expect(isValidMinecraftVersion('b1.8')).toBe(true);
      expect(isValidMinecraftVersion('b1.7.3')).toBe(true);
      expect(isValidMinecraftVersion('b1.7.2')).toBe(true);
      expect(isValidMinecraftVersion('b1.7')).toBe(true);
      expect(isValidMinecraftVersion('b1.6.6')).toBe(true);
      expect(isValidMinecraftVersion('b1.5_01')).toBe(true);
    });
  });

  describe('Development builds', () => {
    it('should validate rd versions', () => {
      expect(isValidMinecraftVersion('rd-20090515')).toBe(true);
      expect(isValidMinecraftVersion('rd-161348')).toBe(true);
      expect(isValidMinecraftVersion('rd-160052')).toBe(true);
    });

    it('should validate c0 versions', () => {
      expect(isValidMinecraftVersion('c0.30_01c')).toBe(true);
      expect(isValidMinecraftVersion('c0.0.13a')).toBe(true);
      expect(isValidMinecraftVersion('c0.0.11a')).toBe(true);
    });

    it('should validate inf versions', () => {
      expect(isValidMinecraftVersion('inf-20100618')).toBe(true);
    });
  });

  describe('Invalid versions', () => {
    it('should reject completely invalid versions', () => {
      expect(isValidMinecraftVersion('invalid')).toBe(false);
      expect(isValidMinecraftVersion('not-a-version')).toBe(false);
      expect(isValidMinecraftVersion('1.21.10-invalid')).toBe(false);
      expect(isValidMinecraftVersion('25w46')).toBe(false);
      expect(isValidMinecraftVersion('26w1')).toBe(false);
    });

    it('should reject incomplete versions', () => {
      expect(isValidMinecraftVersion('1')).toBe(false);
      expect(isValidMinecraftVersion('25w')).toBe(false);
      expect(isValidMinecraftVersion('w46a')).toBe(false);
    });

    it('should reject edge cases', () => {
      expect(isValidMinecraftVersion('')).toBe(false);
      expect(isValidMinecraftVersion('   ')).toBe(false);
      expect(isValidMinecraftVersion('\n')).toBe(false);
      expect(isValidMinecraftVersion('\t')).toBe(false);
    });
  });

  describe('Type safety', () => {
    it('should handle non-string inputs', () => {
      expect(isValidMinecraftVersion(null as any)).toBe(false);
      expect(isValidMinecraftVersion(undefined as any)).toBe(false);
      expect(isValidMinecraftVersion(123 as any)).toBe(false);
      expect(isValidMinecraftVersion({} as any)).toBe(false);
      expect(isValidMinecraftVersion([] as any)).toBe(false);
    });
  });

  describe('Real versions from manifest', () => {
    it('should validate all versions from version_manifest_copy.json', () => {
      const failedVersions: string[] = [];

      manifestData.versions.forEach((version: any) => {
        if (!isValidMinecraftVersion(version.id)) {
          failedVersions.push(version.id);
        }
      });

      expect(failedVersions).toHaveLength(0);
    });

    it('should reject obviously invalid versions not in manifest', () => {
      const invalidVersions = [
        '',                       // empty string
        '   ',                    // whitespace only
        '\t',                     // tab only
        '\n',                     // newline only
        '\r\n',                  // carriage return + newline
        '   1.21.10   ',         // leading/trailing whitespace
        '\t1.21.10\t',           // tab whitespace
        '\n1.21.10\n',           // newline whitespace
        'null',                  // string "null"
        'undefined',             // string "undefined"
        '1',                     // single digit
        '21',                    // two digits no format
        '1.',                    // incomplete
        '.21',                   // backwards
        '1.21.',                 // trailing dot
        '1..21',                 // double dot
        '1.21.10.',              // trailing dot on semver
        '1.21.10.11',            // too many semver parts
        '1.21.10.11.13',         // way too many parts
        'v1.21.10',              // leading v
        '1.21.10v',              // trailing v
        'ver1.21.10',            // leading ver
        'version1.21.10',        // leading version
        '1.21.10-beta',          // hyphen beta not supported
        '1.21.10-alpha',         // hyphen alpha not supported
        '1.21.10-rc',            // rc without number
        '1.21.10-pre',           // pre without number
        '1.21.10-snapshot',      // snapshot without number
        '1.21.10-rc01',          // rc with leading zero
        '1.21.10-pre01',         // pre with leading zero
        '1.21.10-snapshot01',    // snapshot with leading zero
        '1.21.10-rc0',           // rc zero
        '1.21.10-pre0',          // pre zero
        '1.21.10-snapshot0',     // snapshot zero
        '1.21.10-rc-01',         // rc with dash and leading zero
        '1.21.10-pre-01',        // pre with dash and leading zero
        '1.21.10-snapshot-01',   // snapshot with dash and leading zero
        '1.21.10-rc0',           // rc zero with dash
        '1.21.10-pre0',          // pre zero with dash
        '1.21.10-snapshot0',     // snapshot zero with dash
        '1.21-pre5-extra',       // extra suffix
        '1.21-rc1-stuff',        // extra suffix on RC
        '25w46',                 // missing letter
        '25w46bextra',           // extra suffix on snapshot
        '25w46b1',               // number after letter
        '25w461',                // number where letter should be
        'w46a',                  // missing year
        '25w46ab',               // multiple letters
        '25w46bc',               // multiple letters
        '25w46xyz',              // many letters
        '25w',                   // missing week
        'w46a',                  // missing year again
        '25w1a',                 // single digit week
        '25w00a',                // zero week
        '25w99a',                // unrealistic week
        '25w123a',               // too many week digits
        '25w6123a',              // way too many week digits
        '2w46a',                 // single digit year
        '0w46a',                 // zero year
        '26w1a',                 // future year with single digit week
        '99w99a',                // unrealistic future
        '26.1.1.1',              // too many dots in year format
        '26.1-snapshot',         // snapshot without number in year format
        '26.1-rc',               // rc without number in year format
        '26.1-pre',              // pre without number in year format
        '26.1-rc01',             // rc with leading zero in year format
        '26.1-pre01',            // pre with leading zero in year format
        '26.1-snapshot01',       // snapshot with leading zero in year format
        '26.1-rc0',              // rc zero in year format
        '26.1-pre0',             // pre zero in year format
        '26.1-snapshot0',        // snapshot zero in year format
        '26.1-extra',            // extra suffix in year format
        '26.1-beta',             // beta suffix not supported
        '26.1-alpha',            // alpha suffix not supported
        '26.1-dev',              // dev suffix not supported
        '26.1-test',             // test suffix not supported
        '2026.1',                // wrong year format (4 digits)
        '266.1',                 // too many year digits
        '2.1',                   // too few year digits
        '26',                    // year only
        '26.',                   // year with dot
        '.1',                    // content drop only
        '3D Shareware v1.35',    // wrong version of 3D Shareware
        '3D Shareware v1.33',    // wrong version of 3D Shareware
        '1.RV-Pre2',             // wrong RV-Pre version
        '1.RV-Pre0',             // RV-Pre zero
        '1.RV-Pre10',            // RV-Pre double digit
        '1.RV-pre1',             // RV-Pre lowercase
        '1.rv-pre1',             // RV-Pre all lowercase
        '1.RV-PRE1',             // RV-Pre uppercase
        '1.RV-Pre-1',            // RV-Pre with extra dash
        '1.RVPre1',              // RV-Pre missing dash
        '1RVPre1',               // RV-Pre missing period and dash
        '1.14.2 Pre-Release 5',  // wrong pre-release number
        '1.14.2 pre-release 4',  // lowercase pre-release
        '1.14.2 PRE-RELEASE 4',  // uppercase pre-release
        '1.14.2 Pre-release',    // missing number
        '1.14.2 Pre-Release 0',  // zero pre-release
        '1.14.2 Pre-Release 01', // leading zero
        '1.14.2 Pre-Release4',   // missing space
        '1.14.2Pre-Release 4',   // missing space after version
        '1.14.2  Pre-Release 4', // double space
        '1.14.2   Pre-Release 4', // triple space
        '1.19.1 Release Candidate 2', // wrong RC number
        '1.19.1 release candidate 1', // lowercase RC
        '1.19.1 RELEASE CANDIDATE 1', // uppercase RC
        '1.19.1 Release Candidate',   // missing number
        '1.19.1 Release Candidate 0',  // zero RC
        '1.19.1 Release Candidate 01', // leading zero
        '1.19.1 ReleaseCandidate 1',  // missing space
        '1.19.1Release Candidate 1',  // missing space after version
        '1.19.1  Release Candidate 1', // double space
        '1.19.1   Release Candidate 1', // triple space
        '25w13a_or_b_or_c',      // too many options
        '25w13a_or',             // incomplete or
        '25w13a_and_b',          // wrong connector
        '25w13a_or_b_and_c',     // mixed connectors
        '1.21.10-unknown',       // unknown suffix
        '1.21.10-debug',         // debug suffix
        '1.21.10-experimental',  // experimental suffix
        '1.21.10-internal',      // internal suffix
        '1.21.10-devbuild',      // devbuild suffix
        '1.21.10-testbuild',     // testbuild suffix
        'snapshot',              // just the word
        'pre-release',           // just the words
        'release',               // just the word
        'candidate',             // just the word
        'alpha',                 // just the word
        'beta',                  // just the word
        'snapshot-1',            // snapshot without version
        'pre-release-1',         // pre-release without version
        'release-1',             // release without version
        'candidate-1',           // candidate without version
        '1.21.10-snapshot-x',    // non-numeric build
        '1.21.10-pre-x',         // non-numeric build
        '1.21.10-rc-x',          // non-numeric build
        '26.1-snapshot-x',       // non-numeric build year format
        '26.1-pre-x',            // non-numeric build year format
        '26.1-rc-x',             // non-numeric build year format
        '1.21.10-',              // trailing dash
        '26.1-',                 // trailing dash year format
        '-1.21.10',              // leading dash
        '-26.1',                 // leading dash year format
        '1_21_10',               // underscores instead of dots
        '26_1',                  // underscore instead of dot
        '1-21-10',               // dashes instead of dots
        '26-1',                  // dash instead of dot
        '1:21:10',               // colons instead of dots
        '26:1',                  // colon instead of dot
        '1;21;10',               // semicolons instead of dots
        '26;1',                  // semicolon instead of dot
        '1|21|10',               // pipes instead of dots
        '26|1',                  // pipe instead of dot
        '1/21/10',               // slashes instead of dots
        '26/1',                  // slash instead of dot
        '1\\21\\10',             // backslashes instead of dots
        '26\\1',                 // backslash instead of dot
        '1@21@10',               // at signs instead of dots
        '26@1',                  // at sign instead of dot
        '1#21#10',               // hashes instead of dots
        '26#1',                  // hash instead of dot
        '1$21$10',               // dollars instead of dots
        '26$1',                  // dollar instead of dot
        '1%21%10',               // percents instead of dots
        '26%1',                  // percent instead of dot
        '1^21^10',               // carets instead of dots
        '26^1',                  // caret instead of dot
        '1&21&10',               // ampersands instead of dots
        '26&1',                  // ampersand instead of dot
        '1*21*10',               // asterisks instead of dots
        '26*1',                  // asterisk instead of dot
        '1(21)10',               // parentheses instead of dots
        '26(1)',                 // parentheses instead of dot
        '1[21]10',               // brackets instead of dots
        '26[1]',                 // brackets instead of dot
        '1{21}10',               // braces instead of dots
        '26{1}',                 // braces instead of dot
        '1<21>10',               // angle brackets instead of dots
        '26<1>',                 // angle brackets instead of dot
        '1=21=10',               // equals instead of dots
        '26=1',                  // equals instead of dot
        '1+21+10',               // plus instead of dots
        '26+1',                  // plus instead of dot
        '1~21~10',               // tilde instead of dots
        '26~1',                  // tilde instead of dot
        '1`21`10',               // backticks instead of dots
        '26`1',                  // backtick instead of dot
        '1"21"10',               // quotes instead of dots
        '26"1',                  // quotes instead of dot
        "1'21'10",               // single quotes instead of dots
        "26'1",                  // single quotes instead of dot
        '1 21 10',               // spaces instead of dots
        '26 1',                  // space instead of dot
        '1\t21\t10',             // tabs instead of dots
        '26\t1',                 // tab instead of dot
        '1\n21\n10',             // newlines instead of dots
        '26\n1',                 // newline instead of dot
        '1\r21\r10',             // carriage returns instead of dots
        '26\r1',                 // carriage return instead of dot
        '1.21.10 ',              // trailing space
        ' 1.21.10',              // leading space
        ' 1.21.10 ',             // both leading and trailing space
        '26.1 ',                 // trailing space year format
        ' 26.1',                 // leading space year format
        ' 26.1 ',                // both leading and trailing space year format
        '1.21.10\t',             // trailing tab
        '\t1.21.10',             // leading tab
        '\t1.21.10\t',           // both leading and trailing tab
        '26.1\t',                // trailing tab year format
        '\t26.1',                // leading tab year format
        '\t26.1\t',              // both leading and trailing tab year format
        '1.21.10\n',             // trailing newline
        '\n1.21.10',             // leading newline
        '\n1.21.10\n',           // both leading and trailing newline
        '26.1\n',                // trailing newline year format
        '\n26.1',                // leading newline year format
        '\n26.1\n',              // both leading and trailing newline year format
        '999.999.999',           // unrealistic semver
        '999.999',               // unrealistic two-part
        '99.99',                 // unrealistic year format
        '0.0',                   // unrealistic year format with zeros
        '00.00',                 // unrealistic year format with leading zeros
        '999w999a',              // unrealistic snapshot format
        '000w000a',              // unrealistic snapshot format with zeros
        '25w46a' + 'a'.repeat(1000), // extremely long version
        '1.' + '21'.repeat(1000) + '.10', // extremely long semver
        '26.' + '1'.repeat(1000), // extremely long year format
        '1.21.10-pre' + '1'.repeat(1000), // extremely long pre-release
      ];

      invalidVersions.forEach(version => {
        expect(isValidMinecraftVersion(version)).toBe(false);
      });
    });
  });
});