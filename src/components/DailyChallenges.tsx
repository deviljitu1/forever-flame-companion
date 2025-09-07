import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, CheckCircle, Clock } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
  category: string;
}

const dailyChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Send a Voice Message',
    description: 'Record a sweet voice message for your partner',
    difficulty: 'easy',
    points: 10,
    completed: false,
    category: 'communication'
  },
  {
    id: '2',
    title: 'Share a Childhood Memory',
    description: 'Tell your partner about a favorite childhood memory',
    difficulty: 'medium',
    points: 20,
    completed: false,
    category: 'sharing'
  },
  {
    id: '3',
    title: 'Plan Tomorrow Together',
    description: 'Discuss and plan one activity for tomorrow',
    difficulty: 'easy',
    points: 15,
    completed: false,
    category: 'planning'
  },
  {
    id: '4',
    title: 'Express Gratitude',
    description: 'List 3 things you appreciate about your partner',
    difficulty: 'medium',
    points: 25,
    completed: false,
    category: 'appreciation'
  },
  {
    id: '5',
    title: 'Create Something Together',
    description: 'Make a playlist, draw, or create something as a team',
    difficulty: 'hard',
    points: 30,
    completed: false,
    category: 'creativity'
  }
];

export function DailyChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(dailyChallenges);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const { settings } = useSettings();

  useEffect(() => {
    const completed = challenges.filter(c => c.completed).length;
    const points = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0);
    setCompletedCount(completed);
    setTotalPoints(points);
  }, [challenges]);

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true }
        : challenge
    ));
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && settings.hapticFeedback) {
      // Trigger haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    }
    
    toast.success(`Challenge completed! +${challenge?.points} points`, {
      icon: '🎉',
    });
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return '💬';
      case 'sharing': return '🤝';
      case 'planning': return '📅';
      case 'appreciation': return '💝';
      case 'creativity': return '🎨';
      default: return '⭐';
    }
  };

  if (!settings.dailyChallenges) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Daily Challenges
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              <Trophy className="h-3 w-3 mr-1" />
              {totalPoints} points
            </Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {completedCount}/{challenges.length} completed
            </Badge>
          </div>
          <div className="w-24">
            <Progress value={(completedCount / challenges.length) * 100} className="h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              challenge.completed 
                ? 'bg-primary/5 border-primary/20' 
                : 'bg-card border-border hover:border-primary/40'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getCategoryIcon(challenge.category)}</span>
                  <h3 className={`font-medium ${challenge.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {challenge.title}
                  </h3>
                  <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <p className={`text-sm ${challenge.completed ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {challenge.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    +{challenge.points} points
                  </Badge>
                </div>
              </div>
              <div className="flex-shrink-0">
                {challenge.completed ? (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => completeChallenge(challenge.id)}
                    className="min-w-[80px]"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {completedCount === challenges.length && (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold mb-1">All Challenges Complete!</h3>
            <p className="text-muted-foreground">Great job! New challenges will be available tomorrow.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}