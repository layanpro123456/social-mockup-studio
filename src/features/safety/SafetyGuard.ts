import { MockupProject, TemplateKind, WatermarkPosition } from '../../models/types';

export const MANDATORY_WATERMARK_TEXT = 'FICTIONAL MOCKUP' as const;

export const DISALLOWED_KEYWORDS = [
  'verified account',
  'official verification badge',
  'payment confirmed',
  'transaction successful',
  'transfer receipt',
  'bank statement',
  'crypto transfer confirmed',
  'login alert',
  'confidential leak',
  'police warrant',
];

export interface ValidationResult {
  isValid: boolean;
  project?: MockupProject;
  errors: string[];
}

export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '') // Strip html tag delimiters
    .trim();
}

export function checkDisallowedPatterns(text: string): { isSafe: boolean; flaggedTerms: string[] } {
  if (!text) return { isSafe: true, flaggedTerms: [] };
  const lower = text.toLowerCase();
  const flagged = DISALLOWED_KEYWORDS.filter((term) => lower.includes(term));
  return {
    isSafe: flagged.length === 0,
    flaggedTerms: flagged,
  };
}

export function enforceSafetyInvariants(project: Partial<MockupProject>): MockupProject {
  const position: WatermarkPosition =
    project.fictionalLabel?.position &&
    ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(project.fictionalLabel.position)
      ? project.fictionalLabel.position
      : 'bottom-right';

  return {
    schemaVersion: 1,
    id: project.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: sanitizeText(project.title || 'Fictional Mockup Draft'),
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
    frames: project.frames || [],
  };
}

export function validateProjectSchema(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Project data must be a valid JSON object.'] };
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

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const safeProject = enforceSafetyInvariants(raw as unknown as Partial<MockupProject>);
  return { isValid: true, project: safeProject, errors: [] };
}
