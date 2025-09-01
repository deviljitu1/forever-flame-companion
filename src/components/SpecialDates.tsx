import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Heart, Cake, Star, Bell, Plus, Edit, Trash2, Gift } from 'lucide-react';

// ====== TYPES ======
type SpecialDateType = 'birthday' | 'anniversary' | 'recurring' | 'holiday' | 'custom';

interface SpecialDate {
  id: number;
  name: string;
  type: SpecialDateType;
  date: string; // always stored as YYYY-MM-DD
  reminder: boolean;
  notes?: string;
  icon: React.ComponentType<any>;
  recurringDay?: number;
  monthDay?: string;
}

// ====== CONFIG ======
const specialDateTypes: Record<SpecialDateType, { badgeColor: any; label: string; icon: any }> = {
  birthday: { badgeColor: 'destructive', label: 'Birthday', icon: Cake },
  anniversary: { badgeColor: 'warning', label: 'Anniversary', icon: Heart },
  recurring: { badgeColor: 'secondary', label: 'Recurring', icon: Star },
  holiday: { badgeColor: 'primary', label: 'Holiday', icon: Gift },
  custom: { badgeColor: 'outline', label: 'Custom', icon: Calendar },
};

// ====== HELPERS ======
function getNextRecurringDate(dayOfMonth: number) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  let nextDate = new Date(currentYear, currentMonth, dayOfMonth);
  if (nextDate < today) {
    nextDate = new Date(currentYear, currentMonth + 1, dayOfMonth);
  }
  return nextDate;
}

function daysBetween(date1: Date, date2: Date) {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

// ====== INITIAL DATA ======
const initialDates: SpecialDate[] = [
  {
    id: 1,
    name: 'Her Birthday',
    date: '2025-03-15',
    type: 'birthday',
    icon: Cake,
    monthDay: '3-15',
    reminder: true,
    notes: 'Plan a surprise party',
  },
  {
    id: 2,
    name: 'Our Anniversary',
    date: '2025-04-02',
    type: 'anniversary',
    icon: Heart,
    monthDay: '4-2',
    reminder: true,
    notes: 'Book a romantic dinner',
  },
  {
    id: 3,
    name: 'Monthly Date Night',
    date: formatDateForInput(new Date()),
    type: 'recurring',
    icon: Star,
    recurringDay: 14,
    reminder: true,
    notes: 'Try a new activity each month',
  },
  {
    id: 4,
    name: "Valentine's Day",
    date: '2025-02-14',
    type: 'holiday',
    icon: Heart,
    monthDay: '2-14',
    reminder: true,
    notes: 'Get flowers and chocolates',
  },
];

// ====== COMPONENT ======
export function SpecialDates() {
  const [dates, setDates] = useState<SpecialDate[]>(initialDates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<SpecialDate | null>(null);
  const [newDate, setNewDate] = useState<Omit<SpecialDate, 'id' | 'icon'>>({
    name: '',
    type: 'custom',
    date: formatDateForInput(new Date()),
    reminder: true,
    notes: '',
  });
  const [upcomingDates, setUpcomingDates] = useState<(SpecialDate & { actualDate: Date; daysLeft: number; formattedDate: string })[]>([]);

  // ====== CALCULATE UPCOMING ======
  useEffect(() => {
    const today = new Date();

    const calculated = dates.map((date) => {
      let nextDate: Date;
      let formattedDate: string;

      if (date.recurringDay) {
        nextDate = getNextRecurringDate(date.recurringDay);
        formattedDate = `Every ${date.recurringDay}th`;
      } else if (date.monthDay) {
        const [month, day] = date.monthDay.split('-').map(Number);
        let year = today.getFullYear();
        nextDate = new Date(year, month - 1, day);
        if (nextDate < today) nextDate = new Date(year + 1, month - 1, day);
        formattedDate = nextDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      } else {
        nextDate = new Date(date.date);
        formattedDate = nextDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }

      return {
        ...date,
        actualDate: nextDate,
        daysLeft: daysBetween(today, nextDate),
        formattedDate,
      };
    });

    calculated.sort((a, b) => a.daysLeft - b.daysLeft);
    setUpcomingDates(calculated);
  }, [dates]);

  // ====== CRUD HANDLERS ======
  const handleAddDate = () => {
    if (!newDate.name) return;

    const dateToAdd: SpecialDate = {
      id: Date.now(),
      ...newDate,
      icon: specialDateTypes[newDate.type].icon,
    };

    setDates((prev) => [...prev, dateToAdd]);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditDate = () => {
    if (!editingDate) return;

    setDates((prev) =>
      prev.map((d) =>
        d.id === editingDate.id ? { ...editingDate, icon: specialDateTypes[editingDate.type].icon } : d
      )
    );
    setEditingDate(null);
    setIsDialogOpen(false);
  };

  const handleDeleteDate = (id: number) => {
    setDates((prev) => prev.filter((d) => d.id !== id));
  };

  const handleToggleReminder = (id: number) => {
    setDates((prev) => prev.map((d) => (d.id === id ? { ...d, reminder: !d.reminder } : d)));
  };

  const openEditDialog = (date: SpecialDate) => {
    setEditingDate({ ...date });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewDate({
      name: '',
      type: 'custom',
      date: formatDateForInput(new Date()),
      reminder: true,
      notes: '',
    });
    setEditingDate(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  // ====== RENDER ======
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="hidden sm:inline">Special Dates & Reminders</span>
            <span className="sm:hidden">Special Dates</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {dates.length} dates
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {/* ====== DATE LIST ====== */}
        {upcomingDates.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No special dates added yet.</p>
            <p className="text-xs">Add your first special date to get started!</p>
          </div>
        ) : (
          upcomingDates.map((date) => {
            const badgeColor = specialDateTypes[date.type]?.badgeColor || 'secondary';
            const IconComponent = date.icon || Calendar;
            const isSoon = date.daysLeft <= 7;
            const isToday = date.daysLeft === 0;

            return (
              <div
                key={date.id}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border ${
                  isToday
                    ? 'bg-green-50 border-green-200'
                    : isSoon
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gradient-soft border-border/50'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div
                    className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                      isToday
                        ? 'bg-green-100 text-green-600'
                        : isSoon
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-primary-soft text-primary'
                    }`}
                  >
                    <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-xs sm:text-sm truncate">{date.name}</p>
                      {date.reminder && <Bell className="h-3 w-3 text-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{date.formattedDate}</p>
                    {date.notes && <p className="text-xs text-muted-foreground truncate mt-1">{date.notes}</p>}
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2 flex flex-col items-end gap-1">
                  <Badge variant={isToday ? 'default' : isSoon ? 'destructive' : badgeColor} className="text-xs">
                    {isToday ? 'Today!' : `${date.daysLeft}d`}
                  </Badge>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleToggleReminder(date.id)}
                    >
                      <Bell className={`h-3 w-3 ${date.reminder ? 'text-blue-500' : 'text-gray-400'}`} />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => openEditDialog(date)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                      onClick={() => handleDeleteDate(date.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* ====== ADD / EDIT DIALOG ====== */}
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {editingDate ? 'Edit Date' : 'Add New Special Date'}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDate ? 'Edit Special Date' : 'Add New Special Date'}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Event Name</label>
                <Input
                  value={editingDate ? editingDate.name : newDate.name}
                  onChange={(e) =>
                    editingDate
                      ? setEditingDate({ ...editingDate, name: e.target.value })
                      : setNewDate({ ...newDate, name: e.target.value })
                  }
                />
              </div>

              {/* Type */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Event Type</label>
                <Select
                  value={editingDate ? editingDate.type : newDate.type}
                  onValueChange={(value: SpecialDateType) =>
                    editingDate
                      ? setEditingDate({ ...editingDate, type: value })
                      : setNewDate({ ...newDate, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(specialDateTypes).map(([key, { label, icon: Icon }]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={editingDate ? editingDate.date : newDate.date}
                  onChange={(e) =>
                    editingDate
                      ? setEditingDate({ ...editingDate, date: e.target.value })
                      : setNewDate({ ...newDate, date: e.target.value })
                  }
                />
              </div>

              {/* Notes */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Notes</label>
                <Input
                  placeholder="Any special plans or ideas?"
                  value={editingDate ? editingDate.notes : newDate.notes}
                  onChange={(e) =>
                    editingDate
                      ? setEditingDate({ ...editingDate, notes: e.target.value })
                      : setNewDate({ ...newDate, notes: e.target.value })
                  }
                />
              </div>

              {/* Reminder */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingDate ? editingDate.reminder : newDate.reminder}
                  onChange={(e) =>
                    editingDate
                      ? setEditingDate({ ...editingDate, reminder: e.target.checked })
                      : setNewDate({ ...newDate, reminder: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
                <span className="text-sm font-medium">Set Reminder</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingDate ? handleEditDate : handleAddDate} disabled={!(editingDate?.name || newDate.name)}>
                {editingDate ? 'Save Changes' : 'Add Date'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
