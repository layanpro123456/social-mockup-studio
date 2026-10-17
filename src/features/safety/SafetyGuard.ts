import { MockupProject, TemplateKind, WatermarkPosition } from '../../models/types';

export const MANDATORY_WATERMARK_TEXT = 'FICTIONAL MOCKUP' as const;

// Critical fraud & deceptive evidence keywords that trigger export block
export const CRITICAL_FRAUD_KEYWORDS = [
  'wire transfer confirmed',
  'swift code',
  'account balance',
  'transaction id',
  'payment confirmed',
  'payment successful',
  'transfer receipt',
  'bank statement',
  'crypto transfer confirmed',
  'bitcoin transaction confirmed',
  'crypto wallet transfer',
  'one-time password',
  'verification code',
  '2fa code',
  'password reset code',
  'otp code',
  'login alert',
  'login attempt detected',
  'confirm identity to unlock',
  'official verification badge',
  'verified account',
  'arrest warrant',
  'interpol notice',
  'police warrant',
  'court summons',
  'subpoena',
];

// Warning keywords that trigger high-visibility advisory banners
export const WARNING_KEYWORDS = [
  'confidential leak',
  'classified record',
  'police report',
  'internal investigation',
  'fbi inquiry',
];

export const DISALLOWED_KEYWORDS = [...CRITICAL_FRAUD_KEYWORDS, ...WARNING_KEYWORDS];

export interface ValidationResult {
  isValid: boolean;
  project?: MockupProject;
  errors: string[];
}

export interface ContentClassificationResult {
  isSafe: boolean;
  isBlocked: boolean;
  isWarning: boolean;
  flaggedTerms: string[];
  criticalTerms: string[];
  warningTerms: string[];
}

/**
 * Checks for Prototype Pollution payloads in untrusted parsed JSON.
 */
export function hasPrototypePollution(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;

  const stack: unknown[] = [data];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== 'object') continue;

    // Check prototype keys
    if (
      Object.prototype.hasOwnProperty.call(current, '__proto__') ||
      Object.prototype.hasOwnProperty.call(current, 'constructor') ||
      Object.prototype.hasOwnProperty.call(current, 'prototype')
    ) {
      return true;
    }

    // Inspect child entries
    for (const key of Object.keys(current)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return true;
      }
      const val = (current as Record<string, unknown>)[key];
      if (val && typeof val === 'object') {
        stack.push(val);
      }
    }
  }

  return false;
}

/**
 * Strips HTML tag brackets, control characters, and enforces character bounds.
 */
export function sanitizeText(text: string, maxLength = 1000): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '') // Strip HTML brackets to eliminate HTML/script tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '') // Strip ascii control codes
    .trim()
    .slice(0, maxLength);
}

/**
 * Classifies text for deceptive evidence, fraud indicators, and phishing tokens.
 */
export function classifyDeceptiveContent(text: string): ContentClassificationResult {
  if (!text) {
    return {
      isSafe: true,
      isBlocked: false,
      isWarning: false,
      flaggedTerms: [],
      criticalTerms: [],
      warningTerms: [],
    };
  }

  const lower = text.toLowerCase();
  const critical = CRITICAL_FRAUD_KEYWORDS.filter((term) => lower.includes(term));
  const warnings = WARNING_KEYWORDS.filter((term) => lower.includes(term));
  const allFlagged = [...critical, ...warnings];

  return {
    isSafe: allFlagged.length === 0,
    isBlocked: critical.length > 0,
    isWarning: warnings.length > 0,
    flaggedTerms: allFlagged,
    criticalTerms: critical,
    warningTerms: warnings,
  };
}

/**
 * Backward-compatible helper for simple pattern checks.
 */
export function checkDisallowedPatterns(text: string): {
  isSafe: boolean;
  isBlocked: boolean;
  flaggedTerms: string[];
} {
  const result = classifyDeceptiveContent(text);
  return {
    isSafe: result.isSafe,
    isBlocked: result.isBlocked,
    flaggedTerms: result.flaggedTerms,
  };
}

/**
 * Enforces mandatory invariants on the project object.
 */
export function enforceSafetyInvariants(project: Partial<MockupProject>): MockupProject {
  const position: WatermarkPosition =
    project.fictionalLabel?.position &&
    ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(project.fictionalLabel.position)
      ? project.fictionalLabel.position
      : 'bottom-right';

  return {
    schemaVersion: 1,
    id: project.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: sanitizeText(project.title || 'Fictional Mockup Draft', 120),
    template: (project.template as TemplateKind) || 'chat',
    mockup: true,
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    theme: {
      background: project.theme?.background || '#0f172a',
      accent: project.theme?.accent || '#3b82f6',
      fontFamily: project.theme?.fontFamily || 'Inter, sans-serif',
      textColor: project.theme?.textColor || '#f8fafc',
      cardBackground: project.theme?.cardBackground || '#1e293b',
    },
    fictionalLabel: {
      text: MANDATORY_WATERMARK_TEXT,
      enabled: true,
      position,
    },
    content: project.content || {},
    frames: (project.frames || []).slice(0, 10).map((f) => ({
      ...f,
      durationMs: Math.min(Math.max(f.durationMs || 3000, 1000), 10000),
    })),
  };
}

/**
 * Validates untrusted imported project JSON with strict schema checks and security boundaries.
 */
export function validateProjectSchema(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Project data must be a valid JSON object.'] };
  }

  // Security check: Prototype Pollution
  if (hasPrototypePollution(data)) {
    return {
      isValid: false,
      errors: ['Security rejection: Detected prototype pollution attempt (__proto__/constructor).'],
    };
  }

  const raw = data as Record<string, unknown>;

  if (raw.schemaVersion !== 1) {
    errors.push('Unsupported or missing schemaVersion (expected 1).');
  }

  const validTemplates: TemplateKind[] = ['chat', 'feed-post', 'profile-card', 'story', 'short-video'];
  if (typeof raw.template !== 'string' || !validTemplates.includes(raw.template as TemplateKind)) {
    errors.push(`Invalid template kind. Expected one of: ${validTemplates.join(', ')}.`);
  }

  if (raw.mockup !== true) {
    errors.push('Project must have "mockup": true flag for safety and verification.');
  }

  if (!raw.fictionalLabel || typeof raw.fictionalLabel !== 'object') {
    errors.push('fictionalLabel configuration is required.');
  } else {
    const label = raw.fictionalLabel as Record<string, unknown>;
    if (label.enabled !== true) {
      errors.push('fictionalLabel.enabled cannot be disabled.');
    }
    if (label.text !== MANDATORY_WATERMARK_TEXT) {
      errors.push(`fictionalLabel.text must be exactly "${MANDATORY_WATERMARK_TEXT}".`);
    }
  }

  // Length constraints
  if (typeof raw.title === 'string' && raw.title.length > 120) {
    errors.push('Project title exceeds maximum length of 120 characters.');
  }

  if (Array.isArray(raw.frames) && raw.frames.length > 10) {
    errors.push('Frames exceed maximum limit of 10 for short video projects.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const safeProject = enforceSafetyInvariants(raw as unknown as Partial<MockupProject>);
  return { isValid: true, project: safeProject, errors: [] };
}
