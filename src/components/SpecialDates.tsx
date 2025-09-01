import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Cake, Star, Bell } from 'lucide-react';

const upcomingDates = [
  { name: 'Her Birthday', date: 'March 15', daysLeft: 12, type: 'birthday', icon: Cake },
  { name: 'Our Anniversary', date: 'April 2', daysLeft: 30, type: 'anniversary', icon: Heart },
  { name: 'Monthly Date Night', date: 'Every 14th', daysLeft: 5, type: 'recurring', icon: Star },
  { name: 'Valentine\'s Day', date: 'February 14', daysLeft: 45, type: 'holiday', icon: Heart },
];

export function SpecialDates() {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Special Dates & Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingDates.map((date, index) => {
          const Icon = date.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gradient-soft rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-soft rounded-full">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{date.name}</p>
                  <p className="text-xs text-muted-foreground">{date.date}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={date.daysLeft <= 7 ? "destructive" : "secondary"} className="text-xs">
                  {date.daysLeft} days
                </Badge>
                <Button size="sm" variant="ghost" className="mt-1 h-6 px-2 text-xs">
                  <Bell className="h-3 w-3 mr-1" />
                  Remind
                </Button>
              </div>
            </div>
          );
        })}
        
        <Button variant="outline" className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          Add New Special Date
        </Button>
      </CardContent>
    </Card>
  );
}