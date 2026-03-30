import type { ResumeConfig } from '@/components/types';

const STORAGE_KEY = 'resume-config';

export const saveToStorage = (config: ResumeConfig): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
};

export const loadFromStorage = (): ResumeConfig | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearStorage = (): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};
