import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

// Types
export interface Winner {
  position: number;
  house: string;
  name: string;
  points: number;
  photo?: string; // base64 or url
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  category: string;
  gradeLevel: string;
  venue: string;
  winners: Winner[];
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Use real Firebase data with fallback to mock data
    const loadEvents = async () => {
      try {
        console.log('Loading events from Firebase...');
        const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
          const firebaseEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Event);
          console.log('Loaded events from Firebase:', firebaseEvents);
          setEvents(firebaseEvents);
        });
        return () => unsub();
      } catch (error) {
        console.error('Error loading events from Firebase, using mock data:', error);
        // Fallback to mock data if Firebase fails
        const mockEvents: Event[] = [
          {
            id: '1',
            name: 'Dance Competition',
            date: '2025-01-15',
            description: 'Inter-house dance competition',
            category: 'Group',
            gradeLevel: 'Senior',
            venue: 'Auditorium',
            winners: [
              { position: 1, house: 'Delany', name: 'John Doe', points: 10 },
              { position: 2, house: 'Gandhi', name: 'Jane Smith', points: 8 },
              { position: 3, house: 'Tagore', name: 'Mike Johnson', points: 6 }
            ]
          },
          {
            id: '2',
            name: 'Debate Competition',
            date: '2025-01-20',
            description: 'Inter-house debate competition',
            category: 'Individual',
            gradeLevel: 'Senior',
            venue: 'Conference Room',
            winners: [
              { position: 1, house: 'Gandhi', name: 'Sarah Wilson', points: 10 },
              { position: 2, house: 'Aloysius', name: 'Tom Brown', points: 8 },
              { position: 3, house: 'Delany', name: 'Lisa Davis', points: 6 }
            ]
          }
        ];
        setEvents(mockEvents);
      }
    };
    
    loadEvents();
  }, []);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      console.log('Adding event to Firestore:', event);
      const docRef = await addDoc(collection(db, 'events'), event);
      console.log('Event added successfully with ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error adding event to Firestore:', error);
      throw new Error(`Failed to add event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateEvent = async (event: Event) => {
    try {
      console.log('Updating event in Firestore:', event.id);
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, { ...event });
      console.log('Event updated successfully');
    } catch (error) {
      console.error('Error updating event in Firestore:', error);
      throw new Error(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      console.log('Deleting event from Firestore:', id);
      const eventRef = doc(db, 'events', id);
      await deleteDoc(eventRef);
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event from Firestore:', error);
      throw new Error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEventContext must be used within EventProvider');
  return ctx;
}; 