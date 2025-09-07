import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Calendar, Heart, Gift, Cake, Plus } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountdownEvent {
  id: string;
  title: string;
  date: string;
  type: 'anniversary' | 'birthday' | 'vacation' | 'special' | 'custom';
  description?: string;
  icon: string;
}

const initialEvents: CountdownEvent[] = [
  {
    id: '1',
    title: 'First Anniversary',
    date: '2024-12-15',
    type: 'anniversary',
    description: 'One year together!',
    icon: '💕'
  },
  {
    id: '2',
    title: 'Sarah\'s Birthday',
    date: '2024-11-20',
    type: 'birthday',
    description: 'Time to plan something special',
    icon: '🎂'
  },
  {
    id: '3',
    title: 'Weekend Getaway',
    date: '2024-10-25',
    type: 'vacation',
    description: 'Mountain cabin retreat',
    icon: '🏔️'
  }
];

export function CountdownEvents() {
  const [events, setEvents] = useState<CountdownEvent[]>(initialEvents);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'custom' as CountdownEvent['type'],
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { settings } = useSettings();

  const calculateTimeLeft = (targetDate: string) => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const getEventIcon = (type: CountdownEvent['type']) => {
    switch (type) {
      case 'anniversary': return '💕';
      case 'birthday': return '🎂';
      case 'vacation': return '✈️';
      case 'special': return '⭐';
      case 'custom': return '📅';
    }
  };

  const getProgressValue = (targetDate: string) => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const start = now - (30 * 24 * 60 * 60 * 1000); // 30 days ago as reference
    
    const total = target - start;
    const passed = now - start;
    
    return Math.min(100, Math.max(0, (passed / total) * 100));
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event: CountdownEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type,
      description: newEvent.description,
      icon: getEventIcon(newEvent.type)
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({ title: '', date: '', type: 'custom', description: '' });
    setIsDialogOpen(false);
  };

  if (!settings.countdownEvents) {
    return null;
  }

  // Sort events by date
  const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Countdown Events
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Our Anniversary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={newEvent.type} onValueChange={(value: CountdownEvent['type']) => setNewEvent(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="special">Special Event</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add a note about this event"
                  />
                </div>
                <Button onClick={addEvent} className="w-full">
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedEvents.map((event) => {
          const timeLeft = calculateTimeLeft(event.date);
          const progress = getProgressValue(event.date);
          
          return (
            <div
              key={event.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                timeLeft.isPast 
                  ? 'bg-muted/50 border-muted-foreground/20' 
                  : 'bg-card border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{event.icon}</span>
                  <div>
                    <h3 className={`font-medium ${timeLeft.isPast ? 'text-muted-foreground' : ''}`}>
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                </div>
                <Badge variant={timeLeft.isPast ? "secondary" : "default"}>
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(event.date).toLocaleDateString()}
                </Badge>
              </div>

              {!timeLeft.isPast && (
                <>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
                      <div className="text-xs text-muted-foreground">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
                      <div className="text-xs text-muted-foreground">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
                      <div className="text-xs text-muted-foreground">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
                      <div className="text-xs text-muted-foreground">Seconds</div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </>
              )}

              {timeLeft.isPast && (
                <div className="text-center py-2">
                  <span className="text-muted-foreground">🎉 This event has passed!</span>
                </div>
              )}
            </div>
          );
        })}
        
        {events.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Events Yet</h3>
            <p className="text-muted-foreground mb-4">Add your special dates to start counting down!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}