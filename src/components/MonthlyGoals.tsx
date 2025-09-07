import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, CheckCircle, Circle, Trophy } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MonthlyGoal {
  id: string;
  title: string;
  description: string;
  category: 'communication' | 'quality-time' | 'intimacy' | 'personal-growth' | 'adventure';
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  dueDate: string;
}

const initialGoals: MonthlyGoal[] = [
  {
    id: '1',
    title: 'Date Nights',
    description: 'Plan and enjoy regular date nights together',
    category: 'quality-time',
    target: 4,
    current: 2,
    unit: 'nights',
    completed: false,
    dueDate: '2024-10-31'
  },
  {
    id: '2',
    title: 'Deep Conversations',
    description: 'Have meaningful heart-to-heart conversations',
    category: 'communication',
    target: 8,
    current: 5,
    unit: 'conversations',
    completed: false,
    dueDate: '2024-10-31'
  },
  {
    id: '3',
    title: 'Try New Activities',
    description: 'Experience new things together as a couple',
    category: 'adventure',
    target: 3,
    current: 1,
    unit: 'activities',
    completed: false,
    dueDate: '2024-10-31'
  }
];

export function MonthlyGoals() {
  const [goals, setGoals] = useState<MonthlyGoal[]>(initialGoals);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'communication' as MonthlyGoal['category'],
    target: 1,
    unit: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { settings } = useSettings();

  const updateProgress = (goalId: string, increment: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.max(0, Math.min(goal.target, goal.current + increment));
        const completed = newCurrent >= goal.target;
        return { ...goal, current: newCurrent, completed };
      }
      return goal;
    }));
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.unit) return;

    const goal: MonthlyGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      target: newGoal.target,
      current: 0,
      unit: newGoal.unit,
      completed: false,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', description: '', category: 'communication', target: 1, unit: '' });
    setIsDialogOpen(false);
  };

  const getCategoryIcon = (category: MonthlyGoal['category']) => {
    switch (category) {
      case 'communication': return '💬';
      case 'quality-time': return '⏰';
      case 'intimacy': return '💕';
      case 'personal-growth': return '🌱';
      case 'adventure': return '🎯';
    }
  };

  const getCategoryColor = (category: MonthlyGoal['category']) => {
    switch (category) {
      case 'communication': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quality-time': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'intimacy': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'personal-growth': return 'bg-green-100 text-green-800 border-green-200';
      case 'adventure': return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  if (!settings.monthlyGoals) {
    return null;
  }

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalProgress = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Monthly Goals
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={completedGoals === goals.length && goals.length > 0 ? "default" : "secondary"}>
              <Trophy className="h-3 w-3 mr-1" />
              {completedGoals}/{goals.length}
            </Badge>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Monthly Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Weekly Date Nights"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what you want to achieve"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newGoal.category} onValueChange={(value: MonthlyGoal['category']) => setNewGoal(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="quality-time">Quality Time</SelectItem>
                        <SelectItem value="intimacy">Intimacy</SelectItem>
                        <SelectItem value="personal-growth">Personal Growth</SelectItem>
                        <SelectItem value="adventure">Adventure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Number</Label>
                    <Input
                      id="target"
                      type="number"
                      min="1"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., times, hours, activities"
                    />
                  </div>
                  <Button onClick={addGoal} className="w-full">
                    Add Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {goals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
          
          return (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                goal.completed 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-card border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <h3 className={`font-medium ${goal.completed ? 'line-through' : ''}`}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getCategoryColor(goal.category)}>
                    {goal.category.replace('-', ' ')}
                  </Badge>
                  {goal.completed && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress: {goal.current}/{goal.target} {goal.unit}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                
                {!goal.completed && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProgress(goal.id, -1)}
                      disabled={goal.current <= 0}
                    >
                      -1
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateProgress(goal.id, 1)}
                      disabled={goal.current >= goal.target}
                    >
                      +1 {goal.unit.slice(0, -1)}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {goals.length === 0 && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Goals Set</h3>
            <p className="text-muted-foreground mb-4">Set monthly relationship goals to strengthen your bond!</p>
          </div>
        )}
        
        {completedGoals === goals.length && goals.length > 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold mb-1">All Goals Completed!</h3>
            <p className="text-muted-foreground">Amazing work! You're building a stronger relationship.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}