import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Heart, Sparkles, Coffee, Camera, Music } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface WeekendActivity {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'indoor' | 'outdoor' | 'virtual' | 'adventure';
  cost: 'free' | 'low' | 'medium' | 'high';
  mood: string;
  icon: string;
}

const weekendActivities: WeekendActivity[] = [
  {
    id: '1',
    title: 'Cozy Movie Marathon',
    description: 'Pick a movie series and binge-watch with homemade popcorn',
    duration: '3-4 hours',
    type: 'indoor',
    cost: 'free',
    mood: 'relaxed',
    icon: '🍿'
  },
  {
    id: '2',
    title: 'Farmers Market Adventure',
    description: 'Explore local vendors and pick ingredients for dinner',
    duration: '2-3 hours',
    type: 'outdoor',
    cost: 'medium',
    mood: 'energetic',
    icon: '🥕'
  },
  {
    id: '3',
    title: 'Home Spa Day',
    description: 'Face masks, massages, and relaxation together',
    duration: '4-5 hours',
    type: 'indoor',
    cost: 'low',
    mood: 'romantic',
    icon: '🧴'
  },
  {
    id: '4',
    title: 'Photography Walk',
    description: 'Take pictures of your neighborhood or nearby park',
    duration: '1-2 hours',
    type: 'outdoor',
    cost: 'free',
    mood: 'creative',
    icon: '📸'
  },
  {
    id: '5',
    title: 'Cooking Challenge',
    description: 'Try cooking a cuisine neither of you has made before',
    duration: '2-3 hours',
    type: 'indoor',
    cost: 'medium',
    mood: 'playful',
    icon: '👨‍🍳'
  },
  {
    id: '6',
    title: 'Sunrise/Sunset Viewing',
    description: 'Find a beautiful spot to watch the sunrise or sunset',
    duration: '1 hour',
    type: 'outdoor',
    cost: 'free',
    mood: 'romantic',
    icon: '🌅'
  }
];

export function WeekendPlanner() {
  const [selectedActivities, setSelectedActivities] = useState<WeekendActivity[]>([]);
  const [currentSuggestions, setCurrentSuggestions] = useState<WeekendActivity[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    // Generate 3 random suggestions based on mood and preferences
    const shuffled = [...weekendActivities].sort(() => 0.5 - Math.random());
    setCurrentSuggestions(shuffled.slice(0, 3));
  }, []);

  const addToWeekend = (activity: WeekendActivity) => {
    if (!selectedActivities.find(a => a.id === activity.id)) {
      setSelectedActivities(prev => [...prev, activity]);
    }
  };

  const removeFromWeekend = (activityId: string) => {
    setSelectedActivities(prev => prev.filter(a => a.id !== activityId));
  };

  const generateNewSuggestions = () => {
    const shuffled = [...weekendActivities].sort(() => 0.5 - Math.random());
    setCurrentSuggestions(shuffled.slice(0, 3));
  };

  const getCostColor = (cost: WeekendActivity['cost']) => {
    switch (cost) {
      case 'free': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getTypeIcon = (type: WeekendActivity['type']) => {
    switch (type) {
      case 'indoor': return <Coffee className="h-4 w-4" />;
      case 'outdoor': return <MapPin className="h-4 w-4" />;
      case 'virtual': return <Camera className="h-4 w-4" />;
      case 'adventure': return <Music className="h-4 w-4" />;
    }
  };

  if (!settings.weekendPlanning) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Weekend Plan */}
      {selectedActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Your Weekend Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activity.icon}</span>
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.duration}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getCostColor(activity.cost)}`}>
                        {activity.cost}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromWeekend(activity.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Weekend Suggestions
            </CardTitle>
            <Button variant="outline" size="sm" onClick={generateNewSuggestions}>
              New Ideas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSuggestions.map((activity) => (
            <div key={activity.id} className="p-4 rounded-lg border border-border hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{activity.icon}</span>
                    <h3 className="font-medium">{activity.title}</h3>
                    {getTypeIcon(activity.type)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.duration}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getCostColor(activity.cost)}`}>
                      {activity.cost}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Heart className="h-3 w-3 mr-1" />
                      {activity.mood}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => addToWeekend(activity)}
                  disabled={selectedActivities.some(a => a.id === activity.id)}
                >
                  {selectedActivities.some(a => a.id === activity.id) ? 'Added' : 'Add to Plan'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}