
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  User, 
  Bell, 
  Heart, 
  Shield, 
  Smartphone,
  Save,
  Camera,
  Edit3,
  Gift,
  Brain,
  MapPin,
  Gamepad2,
  Calendar,
  MessageSquare,
  Sparkles,
  Clock,
  Package,
  Target,
  Zap
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SettingsPanelProps {
  children: React.ReactNode;
}

export function SettingsPanel({ children }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    // Profile settings
    displayName: 'Alex Johnson',
    bio: 'In love with the most amazing person! 💕',
    relationshipStartDate: '2024-01-15',
    partnerName: 'Sarah Johnson',

    // Notification settings
    moodNotifications: true,
    dateReminders: true,
    giftSuggestions: true,
    partnerActivity: true,
    dailyReminders: false,
    surpriseAlerts: true,
    consolationTips: true,
    weeklyPlanning: true,

    // Gift & Surprise Planning
    autoGiftPlanning: true,
    giftBudget: [100], // Array for slider
    surpriseFrequency: 'weekly',
    favoriteGiftCategories: ['flowers', 'chocolates', 'experiences'],
    giftDeliveryReminders: true,
    localGiftSuggestions: true,

    // Mood & AI Settings
    aiMoodDetection: true,
    moodSharingLevel: 'hints', // 'full', 'hints', 'basic'
    aiSuggestionFrequency: 'smart', // 'frequent', 'smart', 'minimal'
    emotionalAnalysis: true,
    moodHistoryTracking: true,
    aiPersonalization: true,
    consolationStrategies: true,

    // Long Distance Features
    isLongDistance: false,
    timezoneSync: true,
    virtualDatePlanning: false,
    giftDeliveryIntegration: false,
    qualityTimeReminders: true,
    communicationScheduling: false,

    // Gaming & Activities
    coupleGames: true,
    dailyChallenges: true,
    relationshipQuizzes: true,
    moodBasedGames: true,
    competitiveMode: false,
    gameNotifications: true,

    // Special Dates & Events
    birthdayReminders: true,
    anniversaryTracking: true,
    customEventReminders: true,
    weekendPlanning: true,
    monthlyGoals: false,
    countdownEvents: true,

    // Privacy settings
    shareLocation: false,
    publicProfile: false,
    dataSync: true,
    moodDataSharing: 'partner-only', // 'partner-only', 'anonymous', 'private'
    aiDataUsage: 'improve-suggestions',

    // App preferences
    darkMode: false,
    animations: true,
    pushNotifications: true,
    smartNotificationTiming: true,
    voiceAssistant: false,
    hapticFeedback: true,
  });

  const updateSetting = (key: string, value: boolean | string | number[]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving enhanced settings:', settings);
    // Add API call to save settings
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            LoveKeeper Settings
          </SheetTitle>
          <SheetDescription>
            Personalize your relationship experience
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-4 w-4" />
                Profile & Relationship
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Your Name</Label>
                  <Input 
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => updateSetting('displayName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerName">Partner's Name</Label>
                  <Input 
                    id="partnerName"
                    value={settings.partnerName}
                    onChange={(e) => updateSetting('partnerName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationshipStartDate">Relationship Start Date</Label>
                <Input 
                  id="relationshipStartDate"
                  type="date"
                  value={settings.relationshipStartDate}
                  onChange={(e) => updateSetting('relationshipStartDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Relationship Bio</Label>
                <Textarea 
                  id="bio"
                  value={settings.bio}
                  onChange={(e) => updateSetting('bio', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Long Distance Relationship</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable features designed for long-distance couples
                  </p>
                </div>
                <Switch
                  checked={settings.isLongDistance}
                  onCheckedChange={(checked) => updateSetting('isLongDistance', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gift & Surprise Planning */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gift className="h-4 w-4" />
                Gifts & Surprises
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Gift Planning</Label>
                  <p className="text-sm text-muted-foreground">
                    AI suggests gifts based on preferences and occasions
                  </p>
                </div>
                <Switch
                  checked={settings.autoGiftPlanning}
                  onCheckedChange={(checked) => updateSetting('autoGiftPlanning', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Gift Budget Range: ${settings.giftBudget[0]}</Label>
                <Slider
                  value={settings.giftBudget}
                  onValueChange={(value) => updateSetting('giftBudget', value)}
                  max={500}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Surprise Frequency</Label>
                <Select value={settings.surpriseFrequency} onValueChange={(value) => updateSetting('surpriseFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="special-occasions">Special Occasions Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Surprise Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming surprise opportunities
                  </p>
                </div>
                <Switch
                  checked={settings.surpriseAlerts}
                  onCheckedChange={(checked) => updateSetting('surpriseAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Local Gift Suggestions</Label>
                  <p className="text-sm text-muted-foreground">
                    Include local businesses and delivery options
                  </p>
                </div>
                <Switch
                  checked={settings.localGiftSuggestions}
                  onCheckedChange={(checked) => updateSetting('localGiftSuggestions', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI & Mood Intelligence */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-4 w-4" />
                AI & Mood Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI Mood Detection</Label>
                  <p className="text-sm text-muted-foreground">
                    Analyze messages and behavior patterns
                  </p>
                </div>
                <Switch
                  checked={settings.aiMoodDetection}
                  onCheckedChange={(checked) => updateSetting('aiMoodDetection', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Mood Sharing Level</Label>
                <Select value={settings.moodSharingLevel} onValueChange={(value) => updateSetting('moodSharingLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Details</SelectItem>
                    <SelectItem value="hints">Subtle Hints</SelectItem>
                    <SelectItem value="basic">Basic Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Consolation Strategies</Label>
                  <p className="text-sm text-muted-foreground">
                    Step-by-step guidance when partner is upset
                  </p>
                </div>
                <Switch
                  checked={settings.consolationStrategies}
                  onCheckedChange={(checked) => updateSetting('consolationStrategies', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>AI Suggestion Frequency</Label>
                <Select value={settings.aiSuggestionFrequency} onValueChange={(value) => updateSetting('aiSuggestionFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frequent">Frequent</SelectItem>
                    <SelectItem value="smart">Smart Timing</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI Personalization</Label>
                  <p className="text-sm text-muted-foreground">
                    Learn from your relationship patterns
                  </p>
                </div>
                <Switch
                  checked={settings.aiPersonalization}
                  onCheckedChange={(checked) => updateSetting('aiPersonalization', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Long Distance Features */}
          {settings.isLongDistance && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-4 w-4" />
                  Long Distance Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Timezone Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync with partner's timezone
                    </p>
                  </div>
                  <Switch
                    checked={settings.timezoneSync}
                    onCheckedChange={(checked) => updateSetting('timezoneSync', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Gift Delivery Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect with delivery services for surprises
                    </p>
                  </div>
                  <Switch
                    checked={settings.giftDeliveryIntegration}
                    onCheckedChange={(checked) => updateSetting('giftDeliveryIntegration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Communication Scheduling</Label>
                    <p className="text-sm text-muted-foreground">
                      Schedule optimal times to connect
                    </p>
                  </div>
                  <Switch
                    checked={settings.communicationScheduling}
                    onCheckedChange={(checked) => updateSetting('communicationScheduling', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Virtual Date Planning</Label>
                    <p className="text-sm text-muted-foreground">
                      Ideas for virtual dates and shared activities
                    </p>
                  </div>
                  <Switch
                    checked={settings.virtualDatePlanning}
                    onCheckedChange={(checked) => updateSetting('virtualDatePlanning', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gaming & Activities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gamepad2 className="h-4 w-4" />
                Games & Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Couple Games</Label>
                  <p className="text-sm text-muted-foreground">
                    Interactive games to play together
                  </p>
                </div>
                <Switch
                  checked={settings.coupleGames}
                  onCheckedChange={(checked) => updateSetting('coupleGames', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mood-Based Games</Label>
                  <p className="text-sm text-muted-foreground">
                    Games that adapt to your current moods
                  </p>
                </div>
                <Switch
                  checked={settings.moodBasedGames}
                  onCheckedChange={(checked) => updateSetting('moodBasedGames', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Challenges</Label>
                  <p className="text-sm text-muted-foreground">
                    Fun relationship challenges each day
                  </p>
                </div>
                <Switch
                  checked={settings.dailyChallenges}
                  onCheckedChange={(checked) => updateSetting('dailyChallenges', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Competitive Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Add friendly competition to games
                  </p>
                </div>
                <Switch
                  checked={settings.competitiveMode}
                  onCheckedChange={(checked) => updateSetting('competitiveMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Special Dates & Planning */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4" />
                Special Dates & Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anniversary Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track and celebrate relationship milestones
                  </p>
                </div>
                <Switch
                  checked={settings.anniversaryTracking}
                  onCheckedChange={(checked) => updateSetting('anniversaryTracking', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekend Planning</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatic suggestions for weekend activities
                  </p>
                </div>
                <Switch
                  checked={settings.weekendPlanning}
                  onCheckedChange={(checked) => updateSetting('weekendPlanning', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Countdown Events</Label>
                  <p className="text-sm text-muted-foreground">
                    Track countdowns to special occasions
                  </p>
                </div>
                <Switch
                  checked={settings.countdownEvents}
                  onCheckedChange={(checked) => updateSetting('countdownEvents', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Monthly Goals</Label>
                  <p className="text-sm text-muted-foreground">
                    Set and track relationship goals together
                  </p>
                </div>
                <Switch
                  checked={settings.monthlyGoals}
                  onCheckedChange={(checked) => updateSetting('monthlyGoals', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-4 w-4" />
                Smart Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Smart Timing</Label>
                  <p className="text-sm text-muted-foreground">
                    AI optimizes notification timing
                  </p>
                </div>
                <Switch
                  checked={settings.smartNotificationTiming}
                  onCheckedChange={(checked) => updateSetting('smartNotificationTiming', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mood Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Partner's mood changes and hints
                  </p>
                </div>
                <Switch
                  checked={settings.moodNotifications}
                  onCheckedChange={(checked) => updateSetting('moodNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Consolation Tips</Label>
                  <p className="text-sm text-muted-foreground">
                    Guidance when partner needs support
                  </p>
                </div>
                <Switch
                  checked={settings.consolationTips}
                  onCheckedChange={(checked) => updateSetting('consolationTips', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Love Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Gentle reminders to show love
                  </p>
                </div>
                <Switch
                  checked={settings.dailyReminders}
                  onCheckedChange={(checked) => updateSetting('dailyReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Planning</Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly relationship planning suggestions
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyPlanning}
                  onCheckedChange={(checked) => updateSetting('weeklyPlanning', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-4 w-4" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mood Data Sharing</Label>
                <Select value={settings.moodDataSharing} onValueChange={(value) => updateSetting('moodDataSharing', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partner-only">Partner Only</SelectItem>
                    <SelectItem value="anonymous">Anonymous Analytics</SelectItem>
                    <SelectItem value="private">Private Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Location Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share your location with your partner
                  </p>
                </div>
                <Switch
                  checked={settings.shareLocation}
                  onCheckedChange={(checked) => updateSetting('shareLocation', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>AI Data Usage</Label>
                <Select value={settings.aiDataUsage} onValueChange={(value) => updateSetting('aiDataUsage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="improve-suggestions">Improve Suggestions</SelectItem>
                    <SelectItem value="personal-only">Personal Use Only</SelectItem>
                    <SelectItem value="minimal">Minimal Data Usage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync data securely between devices
                  </p>
                </div>
                <Switch
                  checked={settings.dataSync}
                  onCheckedChange={(checked) => updateSetting('dataSync', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* App Experience */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4" />
                App Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Haptic Feedback</Label>
                  <p className="text-sm text-muted-foreground">
                    Gentle vibrations for important moments
                  </p>
                </div>
                <Switch
                  checked={settings.hapticFeedback}
                  onCheckedChange={(checked) => updateSetting('hapticFeedback', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Voice Assistant</Label>
                  <p className="text-sm text-muted-foreground">
                    Voice commands for hands-free use
                  </p>
                </div>
                <Switch
                  checked={settings.voiceAssistant}
                  onCheckedChange={(checked) => updateSetting('voiceAssistant', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Smooth Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Beautiful transitions and effects
                  </p>
                </div>
                <Switch
                  checked={settings.animations}
                  onCheckedChange={(checked) => updateSetting('animations', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Partnership Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-4 w-4" />
                Partnership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Partner Status</p>
                  <p className="text-sm text-muted-foreground">Connected with {settings.partnerName}</p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Heart className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sync Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
