import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AppSettings {
  // Profile settings
  displayName: string;
  bio: string;
  relationshipStartDate: string;
  partnerName: string;

  // Notification settings
  moodNotifications: boolean;
  dateReminders: boolean;
  giftSuggestions: boolean;
  partnerActivity: boolean;
  dailyReminders: boolean;
  surpriseAlerts: boolean;
  consolationTips: boolean;
  weeklyPlanning: boolean;

  // Gift & Surprise Planning
  autoGiftPlanning: boolean;
  giftBudget: number[];
  surpriseFrequency: string;
  favoriteGiftCategories: string[];
  giftDeliveryReminders: boolean;
  localGiftSuggestions: boolean;

  // Mood & AI Settings
  aiMoodDetection: boolean;
  moodSharingLevel: string;
  aiSuggestionFrequency: string;
  emotionalAnalysis: boolean;
  moodHistoryTracking: boolean;
  aiPersonalization: boolean;
  consolationStrategies: boolean;

  // Long Distance Features
  isLongDistance: boolean;
  timezoneSync: boolean;
  virtualDatePlanning: boolean;
  giftDeliveryIntegration: boolean;
  qualityTimeReminders: boolean;
  communicationScheduling: boolean;

  // Gaming & Activities
  coupleGames: boolean;
  dailyChallenges: boolean;
  relationshipQuizzes: boolean;
  moodBasedGames: boolean;
  competitiveMode: boolean;
  gameNotifications: boolean;

  // Special Dates & Events
  birthdayReminders: boolean;
  anniversaryTracking: boolean;
  customEventReminders: boolean;
  weekendPlanning: boolean;
  monthlyGoals: boolean;
  countdownEvents: boolean;

  // Privacy settings
  shareLocation: boolean;
  publicProfile: boolean;
  dataSync: boolean;
  moodDataSharing: string;
  aiDataUsage: string;

  // App preferences
  darkMode: boolean;
  animations: boolean;
  pushNotifications: boolean;
  smartNotificationTiming: boolean;
  voiceAssistant: boolean;
  hapticFeedback: boolean;
}

const defaultSettings: AppSettings = {
  displayName: '',
  bio: '',
  relationshipStartDate: '',
  partnerName: '',
  moodNotifications: true,
  dateReminders: true,
  giftSuggestions: true,
  partnerActivity: true,
  dailyReminders: false,
  surpriseAlerts: true,
  consolationTips: true,
  weeklyPlanning: true,
  autoGiftPlanning: true,
  giftBudget: [100],
  surpriseFrequency: 'weekly',
  favoriteGiftCategories: ['flowers', 'chocolates', 'experiences'],
  giftDeliveryReminders: true,
  localGiftSuggestions: true,
  aiMoodDetection: true,
  moodSharingLevel: 'hints',
  aiSuggestionFrequency: 'smart',
  emotionalAnalysis: true,
  moodHistoryTracking: true,
  aiPersonalization: true,
  consolationStrategies: true,
  isLongDistance: false,
  timezoneSync: true,
  virtualDatePlanning: false,
  giftDeliveryIntegration: false,
  qualityTimeReminders: true,
  communicationScheduling: false,
  coupleGames: true,
  dailyChallenges: true,
  relationshipQuizzes: true,
  moodBasedGames: true,
  competitiveMode: false,
  gameNotifications: true,
  birthdayReminders: true,
  anniversaryTracking: true,
  customEventReminders: true,
  weekendPlanning: true,
  monthlyGoals: false,
  countdownEvents: true,
  shareLocation: false,
  publicProfile: false,
  dataSync: true,
  moodDataSharing: 'partner-only',
  aiDataUsage: 'improve-suggestions',
  darkMode: false,
  animations: true,
  pushNotifications: true,
  smartNotificationTiming: true,
  voiceAssistant: false,
  hapticFeedback: true,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: (key: keyof AppSettings, value: any) => void;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: settings.displayName,
          settings: settings as any
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const loadSettings = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('display_name, settings')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        setIsLoading(false);
        return;
      }

      if (profile?.settings && typeof profile.settings === 'object') {
        setSettings({ ...defaultSettings, ...profile.settings });
      }
      
      if (profile?.display_name) {
        setSettings(prev => ({ ...prev, displayName: profile.display_name }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [user]);

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      saveSettings,
      loadSettings,
      isLoading
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}