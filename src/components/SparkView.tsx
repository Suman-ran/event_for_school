import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import { ArrowLeft, Trophy, Medal, Award, Crown } from 'lucide-react';
import { useEventContext } from './EventContext';

interface SparkViewProps {
  onBack: () => void;
}

const SparkView = ({ onBack }: SparkViewProps) => {
  const { events } = useEventContext();
  // Calculate house scores from all event winners
  const houseMap: Record<string, { name: string; color: string; score: number }> = {
    Delany: { name: 'Delany', color: 'bg-red-600', score: 0 },
    Gandhi: { name: 'Gandhi', color: 'bg-blue-600', score: 0 },
    Tagore: { name: 'Tagore', color: 'bg-green-600', score: 0 },
    Nehru: { name: 'Nehru', color: 'bg-purple-700', score: 0 },
  };
  events.forEach(event => {
    event.winners.forEach(winner => {
      if (houseMap[winner.house]) {
        houseMap[winner.house].score += winner.points;
      }
    });
  });
  const houses = Object.values(houseMap);
  const sortedHouses = [...houses].sort((a, b) => b.score - a.score);
  // Use events from context for the event carousel
  const [api, setApi] = useState<CarouselApi>();

  // Auto-rotation effect
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  const getHouseColor = (house: string) => {
    const colors = {
      'Delany': 'bg-red-600',
      'Gandhi': 'bg-blue-600',
      'Tagore': 'bg-green-600',
      'Nehru': 'bg-purple-700',
    };
    return colors[house as keyof typeof colors] || 'bg-gray-600';
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-500" />;
      default: return null;
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1: return <Trophy className="h-5 w-5 text-gray-400" />;
      case 2: return <Medal className="h-5 w-5 text-orange-500" />;
      default: return <Award className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onBack}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Spark View</h1>
                <p className="text-white/80">Cultural Event Results Showcase</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Live House Standings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Live House Standings</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {sortedHouses.map((house, index) => (
                <div
                  key={house.name}
                  className={`rounded-lg p-4 text-center border border-white/30 ${house.color} text-white backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-center mb-2">
                    {getRankIcon(index)}
                    <span className="text-white font-semibold ml-2">#{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{house.name}</h3>
                  <div className="text-3xl font-bold text-white">{house.score}</div>
                  <p className="text-white/80 text-sm">points</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Results Carousel */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Event Results</h2>
            <Carousel className="w-full max-w-6xl mx-auto" setApi={setApi}>
              <CarouselContent>
                {events.map((event) => (
                  <CarouselItem key={event.id}>
                    <div className="p-6">
                      <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                        <CardContent className="p-8">
                          <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-white mb-2">{event.name}</h3>
                            <p className="text-white/80 text-lg">
                              {new Date(event.date).toLocaleDateString()} • {event.category} • {event.gradeLevel}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {event.winners.map((winner) => (
                              <div 
                                key={winner.position}
                                className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center border border-white/30"
                              >
                                <div className="flex items-center justify-center mb-6">
                                  {getPositionIcon(winner.position)}
                                  <span className="text-white font-bold ml-2 text-xl">
                                    {winner.position === 1 ? '1st' : winner.position === 2 ? '2nd' : '3rd'} Place
                                  </span>
                                </div>
                                
                                <div className="mb-6">
                                  <img 
                                    src={winner.photo || '/placeholder.svg'} 
                                    alt={winner.name}
                                    className="w-48 h-48 object-cover rounded-lg mx-auto mb-6 border-4 border-white/30 shadow-2xl"
                                    onError={(e) => {
                                      // Fallback to placeholder if image fails to load
                                      const target = e.target as HTMLImageElement;
                                      if (target.src !== '/placeholder.svg') {
                                        target.src = '/placeholder.svg';
                                      }
                                    }}
                                  />
                                  <h4 className="text-2xl font-bold text-white mb-3">{winner.name}</h4>
                                  <div className="flex justify-center mb-3">
                                    <span className={`px-4 py-2 rounded-full text-lg font-medium ${getHouseColor(winner.house)}`}>
                                      {winner.house}
                                    </span>
                                  </div>
                                  <div className="text-3xl font-bold text-white">{winner.points} pts</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" />
              <CarouselNext className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SparkView;
