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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="hidden sm:inline">Special Dates & Reminders</span>
          <span className="sm:hidden">Special Dates</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {upcomingDates.map((date, index) => {
          const Icon = date.icon;
          return (
            <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gradient-soft rounded-lg border border-border/50 hover-scale">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 bg-primary-soft rounded-full flex-shrink-0">
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-xs sm:text-sm truncate">{date.name}</p>
                  <p className="text-xs text-muted-foreground">{date.date}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <Badge variant={date.daysLeft <= 7 ? "destructive" : "secondary"} className="text-xs mb-1">
                  {date.daysLeft}d
                </Badge>
                <Button size="sm" variant="ghost" className="h-5 sm:h-6 px-1 sm:px-2 text-xs">
                  <Bell className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                  <span className="hidden sm:inline">Remind</span>
                </Button>
              </div>
            </div>
          );
        })}
        
        <Button variant="outline" className="w-full text-xs sm:text-sm">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span className="hidden sm:inline">Add New Special Date</span>
          <span className="sm:hidden">Add Date</span>
        </Button>
      </CardContent>
    </Card>
  );
}