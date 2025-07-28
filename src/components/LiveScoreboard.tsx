
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const LiveScoreboard = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Use real Firebase data with fallback to mock data
    const loadEvents = async () => {
      try {
        console.log('Loading events for scoreboard from Firebase...');
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
          const firebaseEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Loaded events for scoreboard:', firebaseEvents);
          setEvents(firebaseEvents);
    });
    return () => unsub();
      } catch (error) {
        console.error('Error loading events for scoreboard, using mock data:', error);
        // Fallback to mock data if Firebase fails
        const mockEvents = [
          {
            id: '1',
            name: 'Dance Competition',
            winners: [
              { position: 1, house: 'Delany', name: 'John Doe', points: 10 },
              { position: 2, house: 'Gandhi', name: 'Jane Smith', points: 8 },
              { position: 3, house: 'Tagore', name: 'Mike Johnson', points: 6 },
              { position: 4, house: 'Nehru', name: 'Alex Kumar', points: 4 }
            ]
          },
          {
            id: '2',
            name: 'Debate Competition',
            winners: [
              { position: 1, house: 'Gandhi', name: 'Sarah Wilson', points: 10 },
              { position: 2, house: 'Aloysius', name: 'Tom Brown', points: 8 },
              { position: 3, house: 'Delany', name: 'Lisa Davis', points: 6 },
              { position: 4, house: 'Nehru', name: 'Priya Sharma', points: 4 }
            ]
          }
        ];
        setEvents(mockEvents);
      }
    };
    
    loadEvents();
  }, []);

  // Calculate house scores from all event winners
  const houseMap: Record<string, { name: string; color: string; score: number }> = {
    Delany: { name: 'Delany', color: 'bg-green-600', score: 0 },
    Gandhi: { name: 'Gandhi', color: 'bg-yellow-500', score: 0 },
    Tagore: { name: 'Tagore', color: 'bg-blue-600', score: 0 },
    Nehru: { name: 'Nehru', color: 'bg-purple-700', score: 0 },
  };
  events.forEach((event: any) => {
    event.winners?.forEach((winner: any) => {
      if (houseMap[winner.house]) {
        houseMap[winner.house].score += winner.points;
      }
    });
  });
  const houses = Object.values(houseMap);
  const maxScore = Math.max(...houses.map(h => h.score), 1);
  const sortedHouses = [...houses].sort((a, b) => b.score - a.score);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1: return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2: return <Medal className="h-6 w-6 text-orange-500" />;
      default: return <Award className="h-6 w-6 text-gray-300" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'border-yellow-400 shadow-yellow-100';
      case 1: return 'border-gray-300 shadow-gray-100';
      case 2: return 'border-orange-300 shadow-orange-100';
      default: return 'border-gray-200';
    }
  };

  return (
    <Card className="bg-white shadow-2xl border-0">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Trophy className="h-8 w-8" />
          <span>Live House Standings</span>
        </CardTitle>
        <CardDescription className="text-blue-100">
          Updated in real-time • Last updated: {new Date().toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedHouses.map((house, index) => (
            <div 
              key={house.name}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${house.color} text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getRankIcon(index)}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{house.name}</h3>
                    <p className="text-sm text-gray-500">#{index + 1} Position</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{house.score}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
              
              
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  LEADING
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveScoreboard;
