export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  emoji: string;
}

export type ThemeId = 'lovely-pink' | 'cream-orange' | 'retro-mint' | 'digital-lavender' | 'classic-mac';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string;
  accentColor: string;
  accentBgClass: string;
  windowHeaderBg: string;
  textClass: string;
  cardBg: string;
}
