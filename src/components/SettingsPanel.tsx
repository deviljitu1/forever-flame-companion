import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  User, 
  Bell, 
  Heart, 
  Palette, 
  Shield, 
  Smartphone,
  Save,
  Camera,
  Edit3
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
    
    // Notification settings
    moodNotifications: true,
    dateReminders: true,
    giftSuggestions: true,
    partnerActivity: true,
    dailyReminders: false,
    
    // Privacy settings
    shareLocation: false,
    publicProfile: false,
    dataSync: true,
    
    // App preferences
    darkMode: false,
    animations: true,
    pushNotifications: true,
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend/database
    console.log('Saving settings:', settings);
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
            Settings
          </SheetTitle>
          <SheetDescription>
            Customize your LoveKeeper experience
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-4 w-4" />
                Profile
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
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName"
                  value={settings.displayName}
                  onChange={(e) => updateSetting('displayName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio"
                  value={settings.bio}
                  onChange={(e) => updateSetting('bio', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mood Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your partner updates their mood
                  </p>
                </div>
                <Switch
                  checked={settings.moodNotifications}
                  onCheckedChange={(checked) => updateSetting('moodNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Special Date Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders for birthdays, anniversaries, and special events
                  </p>
                </div>
                <Switch
                  checked={settings.dateReminders}
                  onCheckedChange={(checked) => updateSetting('dateReminders', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Gift Suggestions</Label>
                  <p className="text-sm text-muted-foreground">
                    AI-powered gift recommendations
                  </p>
                </div>
                <Switch
                  checked={settings.giftSuggestions}
                  onCheckedChange={(checked) => updateSetting('giftSuggestions', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Partner Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    Updates about your partner's app activity
                  </p>
                </div>
                <Switch
                  checked={settings.partnerActivity}
                  onCheckedChange={(checked) => updateSetting('partnerActivity', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Love Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Daily suggestions to show love to your partner
                  </p>
                </div>
                <Switch
                  checked={settings.dailyReminders}
                  onCheckedChange={(checked) => updateSetting('dailyReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-4 w-4" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Location</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow your partner to see your location
                  </p>
                </div>
                <Switch
                  checked={settings.shareLocation}
                  onCheckedChange={(checked) => updateSetting('shareLocation', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync data between devices
                  </p>
                </div>
                <Switch
                  checked={settings.dataSync}
                  onCheckedChange={(checked) => updateSetting('dataSync', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* App Preferences Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Smartphone className="h-4 w-4" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth animations and transitions
                  </p>
                </div>
                <Switch
                  checked={settings.animations}
                  onCheckedChange={(checked) => updateSetting('animations', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on this device
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Partnership Section */}
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
                  <p className="text-sm text-muted-foreground">Connected with Sarah Johnson</p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Connected
                </Badge>
              </div>
              
              <Button variant="outline" className="w-full">
                <Edit3 className="h-4 w-4 mr-2" />
                Manage Partnership
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}