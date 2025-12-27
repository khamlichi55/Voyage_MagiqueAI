import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TravelPreferences, TripItinerary, ChatMessage } from '@/types/travel';

interface TravelContextType {
  preferences: TravelPreferences | null;
  setPreferences: (prefs: TravelPreferences) => void;
  itinerary: TripItinerary | null;
  setItinerary: (itinerary: TripItinerary) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  return (
    <TravelContext.Provider
      value={{
        preferences,
        setPreferences,
        itinerary,
        setItinerary,
        chatMessages,
        addChatMessage,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
