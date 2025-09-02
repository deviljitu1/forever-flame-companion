import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Heart, Smile, Meh, Frown, HeartCrack, Send, Lightbulb, Coffee, Music, Camera, Gift, RefreshCw, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const moods = [
  { icon: Heart, label: 'In Love', color: 'text-primary', bg: 'bg-primary-soft', value: 'in_love' },
  { icon: Smile, label: 'Happy', color: 'text-accent', bg: 'bg-accent-soft', value: 'happy' },
  { icon: Meh, label: 'Neutral', color: 'text-muted-foreground', bg: 'bg-muted', value: 'neutral' },
  { icon: Frown, label: 'Sad', color: 'text-secondary', bg: 'bg-secondary-soft', value: 'sad' },
  { icon: HeartCrack, label: 'Upset', color: 'text-destructive', bg: 'bg-destructive/10', value: 'upset' },
];

const consolationSuggestions = {
  in_love: [
    { icon: Heart, text: "Plan a romantic date night together", color: "text-pink-500" },
    { icon: Gift, text: "Surprise them with a thoughtful gift", color: "text-purple-500" },
    { icon: Camera, text: "Take a couple's photo to capture the moment", color: "text-blue-500" }
  ],
  happy: [
    { icon: Coffee, text: "Share a coffee and celebrate together", color: "text-amber-500" },
    { icon: Music, text: "Dance to their favorite song", color: "text-green-500" },
    { icon: Lightbulb, text: "Plan a fun activity they'd enjoy", color: "text-yellow-500" }
  ],
  neutral: [
    { icon: Coffee, text: "Have a cozy chat over coffee", color: "text-amber-500" },
    { icon: Music, text: "Listen to music together", color: "text-green-500" },
    { icon: Lightbulb, text: "Ask what would make their day better", color: "text-yellow-500" }
  ],
  sad: [
    { icon: Heart, text: "Give them a warm hug and listen", color: "text-pink-500" },
    { icon: Coffee, text: "Make them their favorite comfort drink", color: "text-amber-500" },
    { icon: Gift, text: "Surprise them with something small and sweet", color: "text-purple-500" }
  ],
  upset: [
    { icon: Heart, text: "Be patient and offer emotional support", color: "text-pink-500" },
    { icon: Coffee, text: "Give them space but stay available", color: "text-amber-500" },
    { icon: Lightbulb, text: "Ask how you can help them feel better", color: "text-yellow-500" }
  ]
};

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [feelingNote, setFeelingNote] = useState('');
  const [partnerMood, setPartnerMood] = useState<number>(1);
  const [partnerMoodData, setPartnerMoodData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [partnerMoodUpdated, setPartnerMoodUpdated] = useState(false);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);

  // Fetch partner's latest mood
  useEffect(() => {
    fetchPartnerMood();
    fetchMoodHistory();
  }, []);

  const fetchPartnerMood = async (showUpdateNotification = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First, get the partner's user ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('partner_id')
        .eq('user_id', user.id)
        .single();

      if (!profile?.partner_id) {
        // No partner linked, use simulated mood
        return;
      }

      // Get partner's latest mood entry
      const { data: moodEntries, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', profile.partner_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching partner mood:', error);
        return;
      }

      if (moodEntries && moodEntries.length > 0) {
        const latestMood = moodEntries[0];
        const moodIndex = moods.findIndex(m => m.value === latestMood.mood_type);
        if (moodIndex !== -1) {
          // Check if mood has changed
          const previousMoodData = partnerMoodData;
          setPartnerMood(moodIndex);
          setPartnerMoodData(latestMood);
          
          // Show notification if mood changed and it's a manual refresh
          if (showUpdateNotification && previousMoodData && previousMoodData.mood_type !== latestMood.mood_type) {
            setPartnerMoodUpdated(true);
            setTimeout(() => setPartnerMoodUpdated(false), 3000);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching partner mood:', error);
    }
  };

  const handleRefreshPartnerMood = async () => {
    setIsRefreshing(true);
    await fetchPartnerMood(true);
    setIsRefreshing(false);
  };

  const fetchMoodHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get recent mood entries for both users
      const { data: moodEntries, error } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching mood history:', error);
        return;
      }

      setMoodHistory(moodEntries || []);
    } catch (error) {
      console.error('Error fetching mood history:', error);
    }
  };

  const handleMoodSubmit = async () => {
    if (selectedMood === null) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const selectedMoodData = moods[selectedMood];
      
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood_type: selectedMoodData.value,
          mood_label: selectedMoodData.label,
          note: feelingNote.trim() || null
        });

      if (error) {
        console.error('Error saving mood:', error);
        return;
      }

      setLastSubmitted(new Date());
      setFeelingNote('');
      setSelectedMood(null);
      
      // Refresh partner mood and history after submitting
      setTimeout(() => {
        fetchPartnerMood();
        fetchMoodHistory();
      }, 1000);
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConsolationSuggestions = () => {
    if (partnerMoodData) {
      return consolationSuggestions[partnerMoodData.mood_type as keyof typeof consolationSuggestions] || [];
    }
    return consolationSuggestions[moods[partnerMood].value as keyof typeof consolationSuggestions] || [];
  };

  return (
    <Card className="shadow-soft mood-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Mood Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Your Mood Selection */}
        <div>
          <h3 className="text-sm font-medium mb-2 sm:mb-3">How are you feeling?</h3>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {moods.map((mood, index) => {
              const Icon = mood.icon;
              return (
                <Button
                  key={index}
                  variant={selectedMood === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMood(index)}
                  className={`mood-button flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 ${selectedMood === index ? 'bg-gradient-romantic selected' : ''}`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{mood.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Feeling Note Input */}
        {selectedMood !== null && (
          <div className="space-y-2">
            <Label htmlFor="feeling-note" className="text-sm font-medium">
              Share exactly how you're feeling (optional)
            </Label>
            <Textarea
              id="feeling-note"
              placeholder="Tell your partner what's on your mind... 💭"
              value={feelingNote}
              onChange={(e) => setFeelingNote(e.target.value)}
              className="feeling-input min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {feelingNote.length}/500 characters
              </span>
              <Button
                onClick={handleMoodSubmit}
                disabled={isSubmitting}
                size="sm"
                className="bg-gradient-romantic hover:opacity-90"
              >
                <Send className="h-3 w-3 mr-1" />
                {isSubmitting ? 'Saving...' : 'Share Mood'}
              </Button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {lastSubmitted && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg fade-in pulse-gentle">
            <p className="text-sm text-green-700">
              ✅ Mood shared successfully! Your partner will see your update.
            </p>
          </div>
        )}

        {/* Partner Mood Update Notification */}
        {partnerMoodUpdated && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg fade-in pulse-gentle">
            <p className="text-sm text-blue-700">
              💕 Your partner's mood has been updated! Check it out below.
            </p>
          </div>
        )}

        {/* Partner's Mood Section */}
        <div className="pt-3 sm:pt-4 border-t">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-sm font-medium text-primary">💕 Your Partner's Mood</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshPartnerMood}
              disabled={isRefreshing}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {partnerMoodData ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-romantic/5 rounded-lg border border-primary/10">
                {(() => {
                  const Icon = moods[partnerMood].icon;
                  return <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${moods[partnerMood].color}`} />;
                })()}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-base sm:text-lg">{moods[partnerMood].label}</p>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(partnerMoodData.created_at).toLocaleDateString() === new Date().toLocaleDateString() 
                        ? 'Today' 
                        : new Date(partnerMoodData.created_at).toLocaleDateString()
                      }
                    </Badge>
                  </div>
                  {partnerMoodData.note && (
                    <div className="mt-2 p-2 bg-muted/50 rounded-md">
                      <p className="text-sm text-muted-foreground italic">
                        💭 "{partnerMoodData.note}"
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last updated: {new Date(partnerMoodData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              {/* Mood-specific message */}
              {partnerMoodData.mood_type === 'sad' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    💙 Your partner seems sad. Maybe send them a sweet message!
                  </p>
                </div>
              )}
              {partnerMoodData.mood_type === 'upset' && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">
                    🧡 Your partner is feeling upset. Consider reaching out with support.
                  </p>
                </div>
              )}
              {partnerMoodData.mood_type === 'happy' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    💚 Your partner is happy! Perfect time to celebrate together.
                  </p>
                </div>
              )}
              {partnerMoodData.mood_type === 'in_love' && (
                <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
                  <p className="text-sm text-pink-800 font-medium">
                    💖 Your partner is feeling the love! Share this beautiful moment.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 sm:p-4 bg-muted/30 rounded-lg text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No partner mood data yet. Connect with your partner to see their mood updates!
              </p>
            </div>
          )}
        </div>

        {/* Consolation Suggestions */}
        {getConsolationSuggestions().length > 0 && (
          <div className="pt-3 sm:pt-4 border-t">
            <h3 className="text-sm font-medium mb-2 sm:mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              How to support your partner
            </h3>
            <div className="space-y-2">
              {getConsolationSuggestions().map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <div
                    key={index}
                    className="consolation-suggestion flex items-center gap-2 p-2 bg-gradient-soft rounded-lg hover:bg-gradient-romantic/10 fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className={`h-4 w-4 ${suggestion.color}`} />
                    <span className="text-sm text-muted-foreground">{suggestion.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mood History Section */}
        {moodHistory.length > 0 && (
          <div className="pt-3 sm:pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowMoodHistory(!showMoodHistory)}
              className="w-full justify-between p-0 h-auto"
            >
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Mood Updates
              </h3>
              {showMoodHistory ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            {showMoodHistory && (
              <div className="mt-3 space-y-2 fade-in">
                {moodHistory.slice(0, 5).map((entry, index) => {
                  const moodData = moods.find(m => m.value === entry.mood_type);
                  if (!moodData) return null;
                  
                  const Icon = moodData.icon;
                  const isToday = new Date(entry.created_at).toDateString() === new Date().toDateString();
                  const timeAgo = isToday 
                    ? new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : new Date(entry.created_at).toLocaleDateString();
                  
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-2 p-2 bg-gradient-soft rounded-lg fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className={`h-4 w-4 ${moodData.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{moodData.label}</p>
                        {entry.note && (
                          <p className="text-xs text-muted-foreground truncate">
                            "{entry.note}"
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}