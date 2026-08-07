/**
 * IDN-INFRA-001: ICON & COMPONENT REGISTRIES
 * 
 * DERIVED FROM:
 * - IDN-DS-001 (Design System - Icons)
 * - IDN-UIC-001 (Component Library)
 * 
 * PURPOSE:
 * - Central icon registry (Lucide Icons grouped by domain)
 * - Component manifest for all UI components
 * - Ensures consistent icon usage across application
 * - Documents all available components
 * 
 * REQUIREMENTS:
 * - All icons must be sourced from Lucide Icons
 * - Icons grouped by domain/context
 * - Components categorized and documented
 * - Type-safe icon usage
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

// =========================================================================
// ICON REGISTRY
// =========================================================================

/**
 * Central icon registry using Lucide Icons
 * All icons in the application sourced from here
 */
export class IconRegistry {
  private icons: Map<string, LucideIcon> = new Map();
  private aliases: Map<string, string> = new Map(); // alias → icon name

  /**
   * Register an icon
   */
  registerIcon(name: string, icon: LucideIcon, ...aliases: string[]): void {
    this.icons.set(name, icon);

    // Register aliases
    aliases.forEach((alias) => {
      this.aliases.set(alias, name);
    });
  }

  /**
   * Get icon by name or alias
   */
  getIcon(name: string): LucideIcon | undefined {
    const actualName = this.aliases.get(name) || name;
    return this.icons.get(actualName);
  }

  /**
   * Get icon or throw if not found
   */
  getIconOrThrow(name: string): LucideIcon {
    const icon = this.getIcon(name);
    if (!icon) {
      throw new Error(`Icon '${name}' not found in registry`);
    }
    return icon;
  }

  /**
   * List all available icons
   */
  listIcons(): string[] {
    return Array.from(this.icons.keys());
  }

  /**
   * Check if icon exists
   */
  hasIcon(name: string): boolean {
    const actualName = this.aliases.get(name) || name;
    return this.icons.has(actualName);
  }
}

export const iconRegistry = new IconRegistry();

// =========================================================================
// ICON CATEGORIES (Domain-Based)
// =========================================================================

/**
 * NAVIGATION ICONS
 * Used in menus, sidebars, breadcrumbs
 */
export const NavigationIcons = {
  HOME: 'home',
  DASHBOARD: 'layout-dashboard',
  MENU: 'menu',
  SIDEBAR: 'sidebar',
  CHEVRON_DOWN: 'chevron-down',
  CHEVRON_RIGHT: 'chevron-right',
  ARROW_LEFT: 'arrow-left',
  ARROW_RIGHT: 'arrow-right',
  MORE: 'more-horizontal',
  GRID: 'grid',
  LIST: 'list',
  BACK: 'arrow-left',
};

/**
 * ACTION ICONS
 * Used in buttons, controls, interactions
 */
export const ActionIcons = {
  ADD: 'plus',
  CREATE: 'plus-circle',
  EDIT: 'edit-2',
  DELETE: 'trash-2',
  SAVE: 'save',
  CANCEL: 'x',
  CLOSE: 'x',
  CONFIRM: 'check',
  SEARCH: 'search',
  FILTER: 'filter',
  SORT: 'arrow-up-down',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  COPY: 'copy',
  SHARE: 'share-2',
  PRINT: 'printer',
  REFRESH: 'refresh-cw',
  REPLY: 'reply',
  REPORT: 'alert-circle',
  HELP: 'help-circle',
  INFO: 'info',
  SETTINGS: 'settings',
  LOCK: 'lock',
  UNLOCK: 'unlock',
  EYE: 'eye',
  EYE_OFF: 'eye-off',
  SHOW_PASSWORD: 'eye',
  HIDE_PASSWORD: 'eye-off',
  EXPAND: 'expand',
  COLLAPSE: 'collapse',
};

/**
 * STATUS ICONS
 * Used for status indicators, states
 */
export const StatusIcons = {
  SUCCESS: 'check-circle',
  SUCCESS_FILLED: 'check-circle-2',
  ERROR: 'x-circle',
  ERROR_FILLED: 'alert-circle',
  WARNING: 'alert-triangle',
  WARNING_FILLED: 'alert-circle',
  INFO: 'info',
  INFO_FILLED: 'info',
  PENDING: 'clock',
  LOADING: 'loader',
  LOADING_SPINNER: 'loader',
  VERIFIED: 'check-circle-2',
  UNVERIFIED: 'alert-circle',
  APPROVED: 'check-circle-2',
  REJECTED: 'x-circle',
  DENIED: 'ban',
  ACTIVE: 'circle',
  INACTIVE: 'circle',
  ONLINE: 'dot',
  OFFLINE: 'dot',
};

/**
 * FOOTBALL DOMAIN ICONS
 * Used in player, team, match, tournament contexts
 */
export const FootballIcons = {
  PLAYER: 'user',
  PLAYERS: 'users',
  TEAM: 'users-2',
  TEAMS: 'users-2',
  COACH: 'user-check',
  REFEREE: 'user-shield',
  CLUB: 'building',
  STADIUM: 'building-2',
  MATCH: 'zap',
  TOURNAMENT: 'trophy',
  SCORE: 'target',
  BALL: 'circle',
  WHISTLE: 'bell',
  CARD_RED: 'square',
  CARD_YELLOW: 'square',
  FORMATION: 'grid',
  SUBSTITUTION: 'replace',
  PENALTY: 'alert-circle',
};

/**
 * IDENTITY ICONS
 * Used in registration, authentication, verification
 */
export const IdentityIcons = {
  PROFILE: 'user',
  AVATAR: 'user-circle',
  IDENTITY: 'card',
  PASSPORT: 'credit-card',
  VERIFICATION: 'shield-check',
  UNVERIFIED: 'shield-x',
  GUARDIAN: 'heart',
  CHILD: 'baby',
  BIRTHDATE: 'calendar',
  GENDER: 'user',
  CONSENT: 'file-check',
};

/**
 * ORGANIZATION ICONS
 * Used in org, club, federation contexts
 */
export const OrganizationIcons = {
  ORGANIZATION: 'building',
  CLUB: 'building-2',
  FEDERATION: 'organization',
  MEMBER: 'user-check',
  MEMBERS: 'users-2',
  ROLE: 'shield',
  PERMISSION: 'lock',
  ADMIN: 'user-shield',
  OFFICER: 'user-badge',
  MANAGER: 'user',
  HIERARCHY: 'git-branch',
  STRUCTURE: 'git-tree',
};

/**
 * COMMUNICATION ICONS
 * Used in messaging, notifications, alerts
 */
export const CommunicationIcons = {
  MESSAGE: 'message-circle',
  MESSAGES: 'message-square',
  NOTIFICATION: 'bell',
  NOTIFICATIONS_ACTIVE: 'bell-ring',
  NOTIFICATIONS_OFF: 'bell-off',
  EMAIL: 'mail',
  PHONE: 'phone',
  CONTACT: 'contact',
  COMMENT: 'message-circle',
  REPLY: 'reply',
  MENTION: 'at-sign',
  PIN: 'pin',
  ARCHIVE: 'archive',
};

/**
 * UTILITY ICONS
 * Used in forms, UI elements, utilities
 */
export const UtilityIcons = {
  LOADING: 'loader',
  SPINNER: 'loader',
  CALENDAR: 'calendar',
  TIME: 'clock',
  DATE: 'calendar-days',
  RANGE: 'calendar-range',
  TIMEZONE: 'globe',
  LOCATION: 'map-pin',
  MAP: 'map',
  LANGUAGE: 'globe',
  THEME_LIGHT: 'sun',
  THEME_DARK: 'moon',
  THEME_AUTO: 'monitor',
  MOON: 'moon',
  SUN: 'sun',
  STAR: 'star',
  HEART: 'heart',
  BOOKMARK: 'bookmark',
  FLAG: 'flag',
  TAG: 'tag',
  TAGS: 'tags',
  LINK: 'link-2',
  EXTERNAL_LINK: 'external-link',
  UNLINK: 'link-x',
  DOCUMENT: 'file',
  DOCUMENTS: 'file-text',
  FOLDER: 'folder',
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
  TRASH: 'trash-2',
  ARCHIVE: 'archive',
};

/**
 * COMMUNICATION/SOCIAL ICONS
 * Used in contact, sharing, social
 */
export const SocialIcons = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  GITHUB: 'github',
  YOUTUBE: 'youtube',
  WHATSAPP: 'phone',
  TELEGRAM: 'send',
  DISCORD: 'message-circle',
  SLACK: 'message-square',
};

// =========================================================================
// ICON REGISTRATION (Initialization)
// =========================================================================

/**
 * Initialize icon registry with all Lucide icons
 * Call this on app startup
 */
export function initializeIconRegistry(): void {
  // Navigation Icons
  iconRegistry.registerIcon('home', Icons.Home);
  iconRegistry.registerIcon('layout-dashboard', Icons.LayoutDashboard, 'dashboard');
  iconRegistry.registerIcon('menu', Icons.Menu);
  iconRegistry.registerIcon('sidebar', Icons.Sidebar);
  iconRegistry.registerIcon('chevron-down', Icons.ChevronDown);
  iconRegistry.registerIcon('chevron-right', Icons.ChevronRight);
  iconRegistry.registerIcon('arrow-left', Icons.ArrowLeft, 'back');
  iconRegistry.registerIcon('arrow-right', Icons.ArrowRight);
  iconRegistry.registerIcon('more-horizontal', Icons.MoreHorizontal, 'more');
  iconRegistry.registerIcon('grid', Icons.Grid);
  iconRegistry.registerIcon('list', Icons.List);

  // Action Icons
  iconRegistry.registerIcon('plus', Icons.Plus, 'add');
  iconRegistry.registerIcon('plus-circle', Icons.PlusCircle, 'create');
  iconRegistry.registerIcon('edit-2', Icons.Edit2, 'edit');
  iconRegistry.registerIcon('trash-2', Icons.Trash2, 'delete');
  iconRegistry.registerIcon('save', Icons.Save);
  iconRegistry.registerIcon('x', Icons.X, 'close', 'cancel');
  iconRegistry.registerIcon('check', Icons.Check, 'confirm');
  iconRegistry.registerIcon('search', Icons.Search);
  iconRegistry.registerIcon('filter', Icons.Filter);
  iconRegistry.registerIcon('arrow-up-down', Icons.ArrowUpDown, 'sort');
  iconRegistry.registerIcon('download', Icons.Download);
  iconRegistry.registerIcon('upload', Icons.Upload);
  iconRegistry.registerIcon('copy', Icons.Copy);
  iconRegistry.registerIcon('share-2', Icons.Share2, 'share');
  iconRegistry.registerIcon('printer', Icons.Printer, 'print');
  iconRegistry.registerIcon('refresh-cw', Icons.RefreshCw, 'refresh');
  iconRegistry.registerIcon('reply', Icons.Reply);
  iconRegistry.registerIcon('alert-circle', Icons.AlertCircle, 'warning', 'error');
  iconRegistry.registerIcon('help-circle', Icons.HelpCircle, 'help');
  iconRegistry.registerIcon('info', Icons.Info);
  iconRegistry.registerIcon('settings', Icons.Settings);
  iconRegistry.registerIcon('lock', Icons.Lock);
  iconRegistry.registerIcon('unlock', Icons.Unlock);
  iconRegistry.registerIcon('eye', Icons.Eye, 'show-password');
  iconRegistry.registerIcon('eye-off', Icons.EyeOff, 'hide-password');
  iconRegistry.registerIcon('expand', Icons.Expand);
  iconRegistry.registerIcon('collapse', Icons.Collapse);

  // Status Icons
  iconRegistry.registerIcon('check-circle', Icons.CheckCircle, 'success');
  iconRegistry.registerIcon('check-circle-2', Icons.CheckCircle2, 'verified', 'approved');
  iconRegistry.registerIcon('x-circle', Icons.XCircle, 'error');
  iconRegistry.registerIcon('alert-triangle', Icons.AlertTriangle, 'warning');
  iconRegistry.registerIcon('loader', Icons.Loader, 'loading', 'spinner');
  iconRegistry.registerIcon('ban', Icons.Ban, 'denied');
  iconRegistry.registerIcon('circle', Icons.Circle, 'active', 'inactive', 'online', 'offline');

  // Football Icons
  iconRegistry.registerIcon('user', Icons.User, 'player', 'profile');
  iconRegistry.registerIcon('users', Icons.Users, 'players', 'team');
  iconRegistry.registerIcon('users-2', Icons.Users2, 'teams');
  iconRegistry.registerIcon('user-check', Icons.UserCheck, 'coach');
  iconRegistry.registerIcon('user-shield', Icons.UserShield, 'referee', 'admin');
  iconRegistry.registerIcon('building', Icons.Building, 'club', 'organization');
  iconRegistry.registerIcon('building-2', Icons.Building2, 'stadium', 'federation');
  iconRegistry.registerIcon('zap', Icons.Zap, 'match');
  iconRegistry.registerIcon('trophy', Icons.Trophy, 'tournament');
  iconRegistry.registerIcon('target', Icons.Target, 'score');
  iconRegistry.registerIcon('bell', Icons.Bell, 'whistle', 'notification');
  iconRegistry.registerIcon('square', Icons.Square, 'card-red', 'card-yellow');
  iconRegistry.registerIcon('replace', Icons.Replace, 'substitution');

  // Communication Icons
  iconRegistry.registerIcon('message-circle', Icons.MessageCircle, 'message', 'comment');
  iconRegistry.registerIcon('message-square', Icons.MessageSquare, 'messages');
  iconRegistry.registerIcon('bell-ring', Icons.BellRing, 'notifications-active');
  iconRegistry.registerIcon('bell-off', Icons.BellOff, 'notifications-off');
  iconRegistry.registerIcon('mail', Icons.Mail, 'email');
  iconRegistry.registerIcon('phone', Icons.Phone);
  iconRegistry.registerIcon('at-sign', Icons.AtSign, 'mention');
  iconRegistry.registerIcon('pin', Icons.Pin);
  iconRegistry.registerIcon('archive', Icons.Archive);

  // Utility Icons
  iconRegistry.registerIcon('calendar', Icons.Calendar);
  iconRegistry.registerIcon('clock', Icons.Clock, 'time');
  iconRegistry.registerIcon('calendar-days', Icons.CalendarDays, 'date');
  iconRegistry.registerIcon('calendar-range', Icons.CalendarRange, 'range');
  iconRegistry.registerIcon('globe', Icons.Globe, 'language', 'timezone');
  iconRegistry.registerIcon('map-pin', Icons.MapPin, 'location');
  iconRegistry.registerIcon('map', Icons.Map);
  iconRegistry.registerIcon('sun', Icons.Sun, 'theme-light');
  iconRegistry.registerIcon('moon', Icons.Moon, 'theme-dark');
  iconRegistry.registerIcon('monitor', Icons.Monitor, 'theme-auto');
  iconRegistry.registerIcon('star', Icons.Star);
  iconRegistry.registerIcon('heart', Icons.Heart);
  iconRegistry.registerIcon('bookmark', Icons.Bookmark);
  iconRegistry.registerIcon('flag', Icons.Flag);
  iconRegistry.registerIcon('tag', Icons.Tag);
  iconRegistry.registerIcon('tags', Icons.Tags);
  iconRegistry.registerIcon('link-2', Icons.Link2, 'link');
  iconRegistry.registerIcon('external-link', Icons.ExternalLink);
  iconRegistry.registerIcon('link-x', Icons.LinkX, 'unlink');
  iconRegistry.registerIcon('file', Icons.File, 'document');
  iconRegistry.registerIcon('file-text', Icons.FileText, 'documents');
  iconRegistry.registerIcon('folder', Icons.Folder);

  // Social Icons (use regular icons as fallback for missing social icons)
  iconRegistry.registerIcon('facebook', Icons.Facebook);
  iconRegistry.registerIcon('twitter', Icons.Twitter);
  iconRegistry.registerIcon('instagram', Icons.Instagram);
  iconRegistry.registerIcon('linkedin', Icons.Linkedin);
  iconRegistry.registerIcon('github', Icons.Github);
  iconRegistry.registerIcon('youtube', Icons.Youtube);
  iconRegistry.registerIcon('send', Icons.Send, 'telegram');
}

// =========================================================================
// COMPONENT MANIFEST
// =========================================================================

/**
 * Component definition for registry
 */
export interface ComponentDefinition {
  /**
   * Component name
   */
  name: string;

  /**
   * Component category
   */
  category: 'UI' | 'LAYOUT' | 'FORM' | 'DOMAIN' | 'PAGE';

  /**
   * Component description
   */
  description?: string;

  /**
   * File path (for documentation)
   */
  path?: string;

  /**
   * Owned by which feature (if any)
   */
  owner?: string;

  /**
   * Whether this is accessible/reusable
   */
  isPublic?: boolean;

  /**
   * Dependencies (other components, external libs)
   */
  dependencies?: string[];

  /**
   * Status
   */
  status?: 'STABLE' | 'BETA' | 'DEPRECATED';

  /**
   * Accessibility level
   */
  accessibilityLevel?: 'WCAG_AA' | 'WCAG_AAA' | 'PARTIAL';
}

/**
 * Component registry
 */
export class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map();

  register(component: ComponentDefinition): void {
    this.components.set(component.name, component);
  }

  getComponent(name: string): ComponentDefinition | undefined {
    return this.components.get(name);
  }

  getByCategory(category: ComponentDefinition['category']): ComponentDefinition[] {
    return Array.from(this.components.values()).filter(
      (c) => c.category === category
    );
  }

  getAll(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  list(): string[] {
    return Array.from(this.components.keys());
  }
}

export const componentRegistry = new ComponentRegistry();

// =========================================================================
// EXPORTS
// =========================================================================

export {
  IconRegistry,
  iconRegistry,
  ComponentRegistry,
  componentRegistry,
  initializeIconRegistry,
  NavigationIcons,
  ActionIcons,
  StatusIcons,
  FootballIcons,
  IdentityIcons,
  OrganizationIcons,
  CommunicationIcons,
  UtilityIcons,
  SocialIcons,
};

export type { ComponentDefinition };
