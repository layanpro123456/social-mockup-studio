import { describe, it, expect, vi } from 'vitest';
import {
  hasPrototypePollution,
  sanitizeText,
  classifyDeceptiveContent,
  validateProjectSchema,
} from '../features/safety/SafetyGuard';
import {
  validateImageFile,
  validateJsonFile,
  createManagedObjectURL,
  revokeManagedObjectURL,
  revokeAllManagedObjectURLs,
} from '../features/safety/AssetSanitizer';
import { scanProjectForCriticalFraud } from '../components/ExportPanel/ExportPanel';
import { MockupProject } from '../models/types';
import { createDefaultProject } from '../features/templates/templateDefaults';

describe('Security Hardening & Abuse Prevention Suite', () => {
  describe('Prototype Pollution Defenses', () => {
    it('detects and flags __proto__ injection payloads', () => {
      const maliciousJson = JSON.parse('{"__proto__": {"admin": true}}');
      expect(hasPrototypePollution(maliciousJson)).toBe(true);
    });

    it('detects nested constructor/prototype attacks', () => {
      const nestedPayload = {
        title: 'Harmless Title',
        content: {
          constructor: {
            prototype: {
              polluted: true,
            },
          },
        },
      };
      expect(hasPrototypePollution(nestedPayload)).toBe(true);
    });

    it('passes clean hierarchical project objects', () => {
      const cleanProject = createDefaultProject('chat');
      expect(hasPrototypePollution(cleanProject)).toBe(false);
    });

    it('schema validator rejects projects with prototype pollution', () => {
      const payload = JSON.parse(
        '{"schemaVersion": 1, "template": "chat", "mockup": true, "__proto__": {"pwn": true}}'
      );
      const res = validateProjectSchema(payload);
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/prototype pollution/i);
    });
  });

  describe('XSS, Control Codes & Character Bounds', () => {
    it('strips HTML delimiters to neutralize script injection', () => {
      const input = '<img src=x onerror=alert(1)>Hello <script>test()</script>';
      const cleaned = sanitizeText(input);
      expect(cleaned).not.toContain('<');
      expect(cleaned).not.toContain('>');
      expect(cleaned).toContain('Hello');
    });

    it('strips non-printable ASCII control characters', () => {
      const input = 'Safe\u0000Text\u0007With\u001FControls';
      const cleaned = sanitizeText(input);
      expect(cleaned).toBe('SafeTextWithControls');
    });

    it('enforces character length limits', () => {
      const longInput = 'A'.repeat(200);
      const cleaned = sanitizeText(longInput, 50);
      expect(cleaned.length).toBe(50);
    });
  });

  describe('Asset & File Upload Security (AssetSanitizer)', () => {
    it('strictly rejects SVG files to prevent stored SVG script injection', () => {
      const svgFile = new File(['<svg><script>alert("pwn")</script></svg>'], 'avatar.svg', {
        type: 'image/svg+xml',
      });
      const check = validateImageFile(svgFile);
      expect(check.isValid).toBe(false);
      expect(check.error).toMatch(/SVG image uploads are disallowed/i);
    });

    it('rejects image files exceeding 2MB size cap', () => {
      const largeBlob = new Uint8Array(3 * 1024 * 1024); // 3MB
      const largeFile = new File([largeBlob], 'large.png', { type: 'image/png' });
      const check = validateImageFile(largeFile);
      expect(check.isValid).toBe(false);
      expect(check.error).toMatch(/exceeds 2MB limit/i);
    });

    it('accepts valid PNG, JPEG, and WebP images', () => {
      const validPng = new File([new Uint8Array(100)], 'test.png', { type: 'image/png' });
      expect(validateImageFile(validPng).isValid).toBe(true);

      const validJpg = new File([new Uint8Array(100)], 'test.jpg', { type: 'image/jpeg' });
      expect(validateImageFile(validJpg).isValid).toBe(true);

      const validWebp = new File([new Uint8Array(100)], 'test.webp', { type: 'image/webp' });
      expect(validateImageFile(validWebp).isValid).toBe(true);
    });

    it('rejects JSON files exceeding 1MB limit', () => {
      const largeBlob = new Uint8Array(1.5 * 1024 * 1024); // 1.5MB
      const largeJson = new File([largeBlob], 'project.json', { type: 'application/json' });
      const check = validateJsonFile(largeJson);
      expect(check.isValid).toBe(false);
      expect(check.error).toMatch(/exceeds maximum allowed size/i);
    });

    it('tracks and revokes managed object URLs safely', () => {
      const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-123');
      const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

      const dummy = new Blob(['sample']);
      const url = createManagedObjectURL(dummy);
      expect(url).toBe('blob:mock-123');

      revokeManagedObjectURL(url);
      expect(revokeSpy).toHaveBeenCalledWith('blob:mock-123');

      createSpy.mockRestore();
      revokeSpy.mockRestore();
    });
  });

  describe('Deceptive Evidence & Fraud Prevention Gate', () => {
    it('classifies fake financial/banking tokens as critical blockers', () => {
      const banking = classifyDeceptiveContent('Wire transfer confirmed for $50,000 SWIFT code XYZ');
      expect(banking.isBlocked).toBe(true);
      expect(banking.criticalTerms).toContain('wire transfer confirmed');
      expect(banking.criticalTerms).toContain('swift code');
    });

    it('classifies authentication/OTP phishing lures as critical blockers', () => {
      const otp = classifyDeceptiveContent('Your verification code is 849201. 2FA code expires soon.');
      expect(otp.isBlocked).toBe(true);
      expect(otp.criticalTerms).toContain('verification code');
      expect(otp.criticalTerms).toContain('2fa code');
    });

    it('classifies fake warrants and subpoenas as critical blockers', () => {
      const warrant = classifyDeceptiveContent('Official arrest warrant issued by Interpol');
      expect(warrant.isBlocked).toBe(true);
      expect(warrant.criticalTerms).toContain('arrest warrant');
    });

    it('blocks pre-export scan when critical fraud content is present in project', () => {
      const project: MockupProject = createDefaultProject('feed-post');
      project.content = {
        ...project.content,
        caption: 'Here is the payment confirmed bank statement for proof.',
      };

      const scan = scanProjectForCriticalFraud(project);
      expect(scan.isBlocked).toBe(true);
      expect(scan.blockedTerms).toContain('payment confirmed');
      expect(scan.blockedTerms).toContain('bank statement');
    });

    it('allows clean fictional storyboards through export gate', () => {
      const cleanProject: MockupProject = createDefaultProject('chat');
      const scan = scanProjectForCriticalFraud(cleanProject);
      expect(scan.isBlocked).toBe(false);
      expect(scan.blockedTerms).toHaveLength(0);
    });
  });
});
