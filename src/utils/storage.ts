
// Storage utility for managing user settings and drill data
import { EmailConfig } from './email';

export interface UserSettings {
  geminiApiKey?: string;
  emailConfig?: EmailConfig;
  preferences?: {
    theme?: string;
    notifications?: boolean;
  };
}

export interface DrillData {
  id: string;
  targetEmail: string;
  targetName: string;
  subject: string;
  content: string;
  scamLink: string;
  createdAt: Date;
  sentAt?: Date;
  analytics?: DrillAnalytics;
}

export interface DrillAnalytics {
  emailOpened: boolean;
  linkClicked: boolean;
  openedAt?: Date;
  clickedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  status: 'sent' | 'opened' | 'clicked' | 'failed';
}

class StorageManager {
  private static instance: StorageManager;
  private readonly SETTINGS_KEY = 'user_settings';
  private readonly DRILLS_KEY = 'drill_data';

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Settings Management
  saveSettings(settings: UserSettings): void {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    
    // Handle nested objects like emailConfig
    if (settings.emailConfig && currentSettings.emailConfig) {
      updatedSettings.emailConfig = {
        ...currentSettings.emailConfig,
        ...settings.emailConfig
      };
      
      // Handle nested objects within emailConfig
      if (settings.emailConfig.emailjs && currentSettings.emailConfig.emailjs) {
        updatedSettings.emailConfig.emailjs = {
          ...currentSettings.emailConfig.emailjs,
          ...settings.emailConfig.emailjs
        };
      }
      
      if (settings.emailConfig.sms && currentSettings.emailConfig.sms) {
        updatedSettings.emailConfig.sms = {
          ...currentSettings.emailConfig.sms,
          ...settings.emailConfig.sms
        };
      }
      
      if (settings.emailConfig.whatsapp && currentSettings.emailConfig.whatsapp) {
        updatedSettings.emailConfig.whatsapp = {
          ...currentSettings.emailConfig.whatsapp,
          ...settings.emailConfig.whatsapp
        };
      }
    }
    
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updatedSettings));
  }

  getSettings(): UserSettings {
    const settingsStr = localStorage.getItem(this.SETTINGS_KEY);
    return settingsStr ? JSON.parse(settingsStr) : {};
  }

  // Drill Data Management
  saveDrill(drill: DrillData): void {
    const drills = this.getAllDrills();
    drills.push(drill);
    localStorage.setItem(this.DRILLS_KEY, JSON.stringify(drills));
  }

  getAllDrills(): DrillData[] {
    const drillsStr = localStorage.getItem(this.DRILLS_KEY);
    if (!drillsStr) return [];
    
    const drills = JSON.parse(drillsStr);
    return drills.map((drill: any) => ({
      ...drill,
      createdAt: new Date(drill.createdAt),
      sentAt: drill.sentAt ? new Date(drill.sentAt) : undefined,
      analytics: {
        ...drill.analytics,
        openedAt: drill.analytics?.openedAt ? new Date(drill.analytics.openedAt) : undefined,
        clickedAt: drill.analytics?.clickedAt ? new Date(drill.analytics.clickedAt) : undefined,
      }
    }));
  }

  updateDrillAnalytics(drillId: string, analytics: Partial<DrillAnalytics>): void {
    const drills = this.getAllDrills();
    const drillIndex = drills.findIndex(d => d.id === drillId);
    
    if (drillIndex !== -1) {
      drills[drillIndex].analytics = {
        ...drills[drillIndex].analytics,
        ...analytics
      };
      localStorage.setItem(this.DRILLS_KEY, JSON.stringify(drills));
    }
  }

  getDrillById(id: string): DrillData | null {
    const drills = this.getAllDrills();
    return drills.find(d => d.id === id) || null;
  }

  // Analytics and Statistics
  getDashboardStats() {
    const drills = this.getAllDrills();
    
    const totalDrills = drills.length;
    const totalTargets = new Set(drills.map(d => d.targetEmail)).size;
    const clickedDrills = drills.filter(d => d.analytics?.linkClicked).length;
    const openedDrills = drills.filter(d => d.analytics?.emailOpened).length;
    
    const clickRate = totalDrills > 0 ? (clickedDrills / totalDrills) * 100 : 0;
    const openRate = totalDrills > 0 ? (openedDrills / totalDrills) * 100 : 0;
    
    return {
      totalDrills,
      totalTargets,
      clickRate: clickRate.toFixed(1),
      openRate: openRate.toFixed(1),
      successRate: ((totalDrills - clickedDrills) / Math.max(totalDrills, 1) * 100).toFixed(1)
    };
  }
}

export const storage = StorageManager.getInstance();
