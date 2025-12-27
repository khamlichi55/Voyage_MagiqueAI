export interface TravelPreferences {
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  budget: number;
  interests: string[];
  travelStyle: string;
  travelers: number;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  type: 'activity' | 'food' | 'transport' | 'accommodation';
  estimatedCost?: number;
}

export interface DayItinerary {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
}

export interface TripItinerary {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  days: DayItinerary[];
  tips: string[];
  budget: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
