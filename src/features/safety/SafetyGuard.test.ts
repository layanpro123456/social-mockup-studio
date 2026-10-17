import { describe, it, expect } from 'vitest';
import {
  validateProjectSchema,
  enforceSafetyInvariants,
  sanitizeText,
  checkDisallowedPatterns,
  MANDATORY_WATERMARK_TEXT,
} from './SafetyGuard';

describe('SafetyGuard', () => {
  it('enforces mandatory watermark and mockup flag in new projects', () => {
    const rawProject = {
      title: 'Test Mockup',
      template: 'chat' as const,
      fictionalLabel: {
        text: 'SOME OTHER TEXT' as any,
        enabled: false as any,
        position: 'top-left' as const,
      },
    };

    const enforced = enforceSafetyInvariants(rawProject);
    expect(enforced.mockup).toBe(true);
    expect(enforced.fictionalLabel.enabled).toBe(true);
    expect(enforced.fictionalLabel.text).toBe(MANDATORY_WATERMARK_TEXT);
  });

  it('validates a schema-compliant project JSON', () => {
    const validData = {
      schemaVersion: 1,
      id: 'proj_123',
      title: 'Valid Fictional Feed',
      template: 'feed-post',
      mockup: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      theme: {
        background: '#121212',
        accent: '#3b82f6',
        fontFamily: 'Inter',
      },
      fictionalLabel: {
        text: 'FICTIONAL MOCKUP',
        enabled: true,
        position: 'bottom-right',
      },
      content: {},
    };

    const result = validateProjectSchema(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.project?.mockup).toBe(true);
  });

  it('rejects JSON missing mockup=true or with disabled fictionalLabel', () => {
    const invalidData = {
      schemaVersion: 1,
      id: 'proj_123',
      title: 'Sneaky Project',
      template: 'chat',
      mockup: false,
      fictionalLabel: {
        text: 'FICTIONAL MOCKUP',
        enabled: false,
        position: 'bottom-right',
      },
      content: {},
    };

    const result = validateProjectSchema(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Project must have "mockup": true flag for safety and verification.');
    expect(result.errors).toContain('fictionalLabel.enabled cannot be disabled.');
  });

  it('sanitizes HTML tags from user text', () => {
    const dangerousInput = 'Hello <script>alert("pwn")</script> <b>World</b>';
    const sanitized = sanitizeText(dangerousInput);
    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
  });

  it('flags disallowed authenticity claims and deceptive evidence keywords', () => {
    const result1 = checkDisallowedPatterns('Here is the official verification badge for John');
    expect(result1.isSafe).toBe(false);
    expect(result1.flaggedTerms).toContain('official verification badge');

    const result2 = checkDisallowedPatterns('Payment confirmed transfer receipt from bank');
    expect(result2.isSafe).toBe(false);
    expect(result2.flaggedTerms.length).toBeGreaterThanOrEqual(2);

    const safeResult = checkDisallowedPatterns('Hey Alex, are we meeting for coffee tomorrow?');
    expect(safeResult.isSafe).toBe(true);
    expect(safeResult.flaggedTerms).toHaveLength(0);
  });
});
