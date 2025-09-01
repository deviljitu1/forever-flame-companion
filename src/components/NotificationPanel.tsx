import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Heart, Calendar, Gift, MessageCircle, X, Check } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'mood',
    title: 'Partner Mood Update',
    message: 'Your partner marked themselves as feeling sad. Maybe send a sweet message?',
    time: '2 minutes ago',
    isRead: false,
    icon: Heart,
  },
  {
    id: 2,
    type: 'date',
    title: 'Special Date Reminder',
    message: 'Her birthday is in 5 days! Have you planned something special?',
    time: '1 hour ago',
    isRead: false,
    icon: Calendar,
  },
  {
    id: 3,
    type: 'gift',
    title: 'Gift Idea Suggestion',
    message: 'Based on her interests, we found a perfect gift idea for you!',
    time: '3 hours ago',
    isRead: true,
    icon: Gift,
  },
  {
    id: 4,
    type: 'message',
    title: 'New Love Message',
    message: 'You received a sweet message from your partner ❤️',
    time: '1 day ago',
    isRead: true,
    icon: MessageCircle,
  },
];

interface NotificationPanelProps {
  children: React.ReactNode;
}

export function NotificationPanel({ children }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mood': return 'text-primary';
      case 'date': return 'text-accent';
      case 'gift': return 'text-secondary';
      case 'message': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </SheetTitle>
          <SheetDescription>
            Stay updated on your relationship activities
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="w-full"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card 
                    key={notification.id} 
                    className={`p-3 transition-all hover:shadow-md ${
                      !notification.isRead ? 'border-primary/50 bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full bg-gradient-soft ${getTypeColor(notification.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}