import { MockupProject } from '../models/types';
import { validateProjectSchema, enforceSafetyInvariants } from '../features/safety/SafetyGuard';

const STORAGE_KEY = 'social_mockup_current_project';

export function saveProjectToLocal(project: MockupProject): void {
  try {
    const safeProject = enforceSafetyInvariants(project);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeProject));
  } catch (err) {
    console.error('Failed to save project to localStorage', err);
  }
}

export function loadProjectFromLocal(): MockupProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validation = validateProjectSchema(parsed);
    if (validation.isValid && validation.project) {
      return validation.project;
    }
  } catch (err) {
    console.error('Failed to load project from localStorage', err);
  }
  return null;
}

export function exportProjectAsJSON(project: MockupProject): void {
  const safeProject = enforceSafetyInvariants(project);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(safeProject, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${safeProject.title.replace(/\s+/g, '_')}_mockup.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export async function importProjectFromJSON(file: File): Promise<{ project?: MockupProject; errors: string[] }> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const validation = validateProjectSchema(parsed);
    if (!validation.isValid) {
      return { errors: validation.errors };
    }
    return { project: validation.project, errors: [] };
  } catch (err) {
    return { errors: [`Invalid JSON file: ${(err as Error).message}`] };
  }
}
