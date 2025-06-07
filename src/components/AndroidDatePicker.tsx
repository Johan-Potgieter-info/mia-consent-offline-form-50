
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AndroidDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
}

const AndroidDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date",
  className,
  maxDate = new Date(),
  minDate = new Date(1940, 0, 1)
}: AndroidDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(value || new Date());

  // Generate years from 1940 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1940 + 1 }, 
    (_, i) => currentYear - i
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleYearChange = (year: string) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(parseInt(year));
    setDisplayMonth(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(parseInt(month));
    setDisplayMonth(newDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-12 text-base",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          {value ? format(value, "dd/MM/yyyy") : placeholder}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/* Year and Month selectors for easier navigation */}
        <div className="flex items-center justify-between p-3 border-b">
          <Select
            value={displayMonth.getMonth().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={displayMonth.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setIsOpen(false);
          }}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          disabled={(date) =>
            date > maxDate || date < minDate
          }
          initialFocus
          className="p-3 pointer-events-auto"
          classNames={{
            day: "h-9 w-9 text-base",
            day_selected: "bg-[#ef4805] text-white hover:bg-[#ef4805] hover:text-white focus:bg-[#ef4805] focus:text-white"
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AndroidDatePicker;
