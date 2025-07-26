import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Save, Calendar, Trophy, Users, Settings, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEventContext, Event } from './EventContext';
import { uploadPhoto, generatePhotoPath, base64ToBlob } from '@/lib/firebase-storage';
import { logoutAdmin } from '@/lib/firebase-auth';

interface AdminDashboardProps {
  onBack: () => void;
}

interface Winner {
  position: number;
  house: string;
  name: string;
  points: number;
}

interface EventResult {
  id: string;
  eventName: string;
  eventDate: string;
  winners: Winner[];
}

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const { toast } = useToast();
  const { events, addEvent, updateEvent, deleteEvent } = useEventContext();
  const [activeTab, setActiveTab] = useState('events');
  const [editingResult, setEditingResult] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const selectedEvent = events.find(e => e.id === selectedEventId);
  // For resultWinners, always provide a 'photo' property (even if undefined)
  const [resultWinners, setResultWinners] = useState([
    { position: 1, house: '', name: '', points: 10, photo: undefined },
    { position: 2, house: '', name: '', points: 7, photo: undefined },
    { position: 3, house: '', name: '', points: 5, photo: undefined }
  ]);

  useEffect(() => {
    if (selectedEvent) {
      // Determine default points based on category
      const isGroup = selectedEvent.category === 'Group';
      const defaultPoints = isGroup ? [20, 15, 10] : [10, 7, 5];
      // If there are no winners, set defaults
      if (!selectedEvent.winners || selectedEvent.winners.length === 0) {
        setResultWinners([
          { position: 1, house: '', name: '', points: defaultPoints[0], photo: undefined },
          { position: 2, house: '', name: '', points: defaultPoints[1], photo: undefined },
          { position: 3, house: '', name: '', points: defaultPoints[2], photo: undefined }
        ]);
      } else {
        // If winners exist, keep their points, but for new added winners, use correct default
        setResultWinners(selectedEvent.winners.map((w, i) => ({ ...w, photo: w.photo !== undefined ? w.photo : undefined, points: w.points ?? defaultPoints[w.position-1] })));
      }
    } else {
      setResultWinners([
        { position: 1, house: '', name: '', points: 10, photo: undefined },
        { position: 2, house: '', name: '', points: 7, photo: undefined },
        { position: 3, house: '', name: '', points: 5, photo: undefined }
      ]);
    }
  }, [selectedEvent]);

  const handleResultWinnerChange = (index: number, field: string, value: any) => {
    const updated = [...resultWinners];
    updated[index] = { ...updated[index], [field]: value };
    setResultWinners(updated);
  };

  const handleSaveResults = async () => {
    if (selectedEvent) {
      try {
        // Clean winners: remove undefined fields
        const cleanedWinners = resultWinners.map(winner => {
          const cleaned = { ...winner };
          Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === undefined) {
              delete cleaned[key];
            }
          });
          return cleaned;
        });
        
        console.log('Updating event results:', selectedEvent.id);
        await updateEvent({ ...selectedEvent, winners: cleanedWinners });
        
        toast({
          title: 'Results Updated',
          description: `Winners for ${selectedEvent.name} have been updated.`,
        });
      } catch (error) {
        console.error('Error updating results:', error);
        toast({
          title: "Error Updating Results",
          description: error instanceof Error ? error.message : "Failed to update results. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Restore newEvent and newWinners for Events tab
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'winners'>>({
    name: '',
    description: '',
    date: '',
    category: '',
    gradeLevel: '',
    venue: ''
  });
  const [newWinners, setNewWinners] = useState([
    { position: 1, house: '', name: '', points: 10, photo: undefined },
    { position: 2, house: '', name: '', points: 7, photo: undefined },
    { position: 3, house: '', name: '', points: 5, photo: undefined }
  ]);

  const handleAddEvent = async () => {
    try {
      // Validate required fields
      if (!newEvent.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Event name is required.",
          variant: "destructive",
        });
        return;
      }

      if (!newEvent.date) {
        toast({
          title: "Validation Error",
          description: "Event date is required.",
          variant: "destructive",
        });
        return;
      }

      // Clean winners: remove undefined fields
      const cleanedWinners = newWinners.map(winner => {
        const cleaned = { ...winner };
        Object.keys(cleaned).forEach(key => {
          if (cleaned[key] === undefined) {
            delete cleaned[key];
          }
        });
        return cleaned;
      });

      // Clean event: remove undefined fields
      const cleanedEvent = { ...newEvent, winners: cleanedWinners };
      Object.keys(cleanedEvent).forEach(key => {
        if (cleanedEvent[key] === undefined) {
          delete cleanedEvent[key];
        }
      });

      console.log('Adding event:', cleanedEvent);
      await addEvent(cleanedEvent);
      
      toast({
        title: 'Event Added Successfully',
        description: `${newEvent.name} has been added to the system.`,
      });
      
      // Reset form
      setNewEvent({ name: '', description: '', date: '', category: '', gradeLevel: '', venue: '' });
      setNewWinners([
        { position: 1, house: '', name: '', points: 10, photo: undefined },
        { position: 2, house: '', name: '', points: 7, photo: undefined },
        { position: 3, house: '', name: '', points: 5, photo: undefined }
      ]);
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Error Adding Event",
        description: error instanceof Error ? error.message : "Failed to add event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditResult = (result: Event) => {
    setEditingResult({ ...result });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingResult) {
      try {
        console.log('Saving edited event:', editingResult.id);
        await updateEvent(editingResult);
        
        toast({
          title: "Results Updated Successfully",
          description: "Event results have been updated.",
        });
        setIsEditDialogOpen(false);
        setEditingResult(null);
      } catch (error) {
        console.error('Error saving edit:', error);
        toast({
          title: "Error Saving Changes",
          description: error instanceof Error ? error.message : "Failed to save changes. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteResult = async (resultId: string) => {
    try {
      console.log('Deleting event:', resultId);
      await deleteEvent(resultId);
      
      toast({
        title: "Result Deleted",
        description: "Event result has been removed.",
      });
    } catch (error) {
      console.error('Error deleting result:', error);
      toast({
        title: "Error Deleting Result",
        description: error instanceof Error ? error.message : "Failed to delete result. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateEditingWinner = (index: number, field: string, value: string | number) => {
    if (editingResult) {
      const updatedWinners = [...editingResult.winners];
      updatedWinners[index] = { ...updatedWinners[index], [field]: value };
      setEditingResult({ ...editingResult, winners: updatedWinners });
    }
  };

  const handleExportCSV = () => {
    // Prepare CSV header
    const header = [
      'Event Name',
      'Event Date',
      'Winner Position',
      'House',
      'Winner Name',
      'Points'
    ];
    // Flatten results for CSV rows
    const rows = events.flatMap(event =>
      event.winners.map(winner => [
        event.name,
        event.date,
        winner.position,
        winner.house,
        winner.name,
        winner.points
      ])
    );
    // Combine header and rows
    const csvContent = [header, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export Successful',
      description: 'Results exported as CSV.',
    });
  };

  // Calculate stats
  const totalEvents = events.length;
  const awards = events.reduce((sum, e) => sum + e.winners.length, 0);

  // Add Winner handler
  const handleAddWinner = () => {
    if (!selectedEvent) return;
    const isGroup = selectedEvent.category === 'Group';
    const defaultPoints = isGroup ? 20 : 10;
    setResultWinners([
      ...resultWinners,
      { position: 1, house: '', name: '', points: defaultPoints, photo: undefined }
    ]);
  };

  // Remove Winner handler
  const handleRemoveWinner = (index: number) => {
    setResultWinners(resultWinners.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Public View</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Settings className="h-6 w-6 text-blue-600" />
                <span>Admin Dashboard</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Management</span>
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Event</span>
                </CardTitle>
                <CardDescription>Create a new cultural event for the school houses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                      placeholder="e.g., Classical Dance Competition"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventDate">Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea
                    id="eventDescription"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Brief description of the event..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={newEvent.category} onValueChange={(value) => setNewEvent({...newEvent, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Grade Level</Label>
                    <Select value={newEvent.gradeLevel} onValueChange={(value) => setNewEvent({...newEvent, gradeLevel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Junior">Junior (1-5)</SelectItem>
                        <SelectItem value="Middle">Middle (6-8)</SelectItem>
                        <SelectItem value="Senior">Senior (9-12)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                      placeholder="e.g., Main Auditorium"
                    />
                  </div>
                </div>

                <Button onClick={handleAddEvent} className="w-full md:w-auto flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Add Event</span>
                </Button>
              </CardContent>
            </Card>

            {/* Add a table/list of all events in the Admin page (Events tab) */}
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-2">All Events</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map(event => (
                    <TableRow key={event.id}>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell>{event.category}</TableCell>
                      <TableCell>{event.gradeLevel}</TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => deleteEvent(event.id)} className="text-red-600">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Add Event Results</span>
                </CardTitle>
                <CardDescription>Record winners and update house scores with photos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Select Event</Label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map(event => (
                        <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedEvent && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {resultWinners.map((winner, index) => (
                      <Card key={index} className="border-2 border-dashed relative">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            {winner.position === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                            {winner.position === 2 && <Trophy className="h-5 w-5 text-gray-400" />}
                            {winner.position === 3 && <Trophy className="h-5 w-5 text-orange-500" />}
                            <span>{winner.position === 1 ? '1st' : winner.position === 2 ? '2nd' : winner.position === 3 ? '3rd' : `${winner.position}th`} Place</span>
                          </CardTitle>
                          <Button type="button" size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => handleRemoveWinner(index)}>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Winner Photo</Label>
                            {winner.photo ? (
                              <div className="relative">
                                <img 
                                  src={winner.photo} 
                                  alt="Winner preview" 
                                  className="w-full h-32 object-cover rounded-lg border"
                                  onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== '/placeholder.svg') {
                                      target.src = '/placeholder.svg';
                                    }
                                  }}
                                />
                                <Button type="button" onClick={() => {
                                  const updated = [...resultWinners];
                                  updated[index].photo = undefined;
                                  setResultWinners(updated);
                                }} className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600">
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <Input
                                  type="file"
                                  accept="image/*,.webp"
                                  onChange={async e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      // Validate file type
                                      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                                      if (!validTypes.includes(file.type)) {
                                        toast({
                                          title: "Invalid file type",
                                          description: "Please upload a valid image file (JPEG, PNG, GIF, or WebP).",
                                          variant: "destructive",
                                        });
                                        return;
                                      }
                                      
                                      // Validate file size (max 5MB)
                                      if (file.size > 5 * 1024 * 1024) {
                                        toast({
                                          title: "File too large",
                                          description: "Please upload an image smaller than 5MB.",
                                          variant: "destructive",
                                        });
                                        return;
                                      }
                                      
                                      // Show loading state
                                      toast({
                                        title: "Uploading photo...",
                                        description: "Please wait while we upload your image.",
                                      });
                                      
                                      // Use base64 storage for now (to avoid CORS issues)
                                      console.log('Saving photo as base64...');
                                      const reader = new FileReader();
                                      reader.onload = (e) => {
                                        const updated = [...resultWinners];
                                        updated[index].photo = e.target?.result as string;
                                        setResultWinners(updated);
                                        toast({
                                          title: "Photo saved successfully",
                                          description: "Photo has been saved to the database.",
                                        });
                                      };
                                      reader.onerror = () => {
                                        toast({
                                          title: "Photo save failed",
                                          description: "Failed to process the image. Please try again.",
                                          variant: "destructive",
                                        });
                                      };
                                      reader.readAsDataURL(file);
                                      
                                      // TODO: Uncomment below code after fixing CORS
                                      /*
                                      // Upload to Firebase Storage
                                      try {
                                        console.log('Starting photo upload for event:', selectedEvent.id);
                                        const photoPath = generatePhotoPath(selectedEvent.id, file.name, index + 1);
                                        console.log('Photo path:', photoPath);
                                        
                                        const downloadURL = await uploadPhoto(file, photoPath);
                                        console.log('Photo uploaded successfully:', downloadURL);
                                        
                                        const updated = [...resultWinners];
                                        updated[index].photo = downloadURL;
                                        setResultWinners(updated);
                                        
                                        toast({
                                          title: "Photo uploaded successfully",
                                          description: "Photo has been uploaded to Firebase Storage.",
                                        });
                                      } catch (error) {
                                        console.error('Photo upload error:', error);
                                        toast({
                                          title: "Upload failed",
                                          description: error instanceof Error ? error.message : "Failed to upload photo. Please check Firebase Storage configuration.",
                                          variant: "destructive",
                                        });
                                      }
                                      */
                                    }
                                  }}
                                  className="hidden"
                                  id={`result-photo-${index}`} />
                                <Label htmlFor={`result-photo-${index}`} className="cursor-pointer text-blue-600 hover:text-blue-700">
                                  Click to upload photo (JPEG, PNG, GIF, WebP - max 5MB)
                                </Label>
                              </div>
                            )}
                          </div>
                          <div>
                            <Label>House</Label>
                            <Select value={winner.house} onValueChange={value => handleResultWinnerChange(index, 'house', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select house" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Delany">Delany</SelectItem>
                                <SelectItem value="Gandhi">Gandhi</SelectItem>
                                <SelectItem value="Tagore">Tagore</SelectItem>
                                <SelectItem value="Aloysius">Aloysius</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Winner Name</Label>
                            <Input
                              value={winner.name}
                              onChange={e => handleResultWinnerChange(index, 'name', e.target.value)}
                              placeholder="Enter name or team name"
                            />
                          </div>
                          <div>
                            <Label>Points</Label>
                            <Input
                              type="number"
                              value={winner.points}
                              onChange={e => handleResultWinnerChange(index, 'points', parseInt(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label>Position</Label>
                            <Input
                              type="number"
                              min={1}
                              value={winner.position}
                              onChange={e => handleResultWinnerChange(index, 'position', parseInt(e.target.value))}
                              placeholder="Position"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="flex items-center mt-4">
                      <Button type="button" variant="outline" onClick={handleAddWinner}>
                        <Plus className="h-4 w-4 mr-2" /> Add Winner
                      </Button>
                    </div>
                  </div>
                )}
                {selectedEvent && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleSaveResults} className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Results</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Existing Results Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>Existing Results</span>
                </CardTitle>
                <CardDescription>Edit or delete previously entered results</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Winners</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {event.winners.map((winner, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {winner.house}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditResult(event)}
                              className="flex items-center space-x-1"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                try {
                                  console.log('Clearing results for event:', event.id);
                                  await updateEvent({ ...event, winners: [] });
                                  
                                  toast({
                                    title: "Results Cleared",
                                    description: `All results for ${event.name} have been cleared.`,
                                  });
                                } catch (error) {
                                  console.error('Error clearing results:', error);
                                  toast({
                                    title: "Error Clearing Results",
                                    description: error instanceof Error ? error.message : "Failed to clear results. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Edit Results Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Event Results</DialogTitle>
                  <DialogDescription>
                    Modify the winners and their details for {editingResult?.name}
                  </DialogDescription>
                </DialogHeader>
                
                {editingResult && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {editingResult.winners.map((winner, index) => (
                        <Card key={index} className="border-2 border-dashed">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center space-x-2">
                              {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                              {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                              {index === 2 && <Trophy className="h-5 w-5 text-orange-500" />}
                              <span>{index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'} Place</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Photo Upload Section */}
                            <div>
                              <Label>Winner Photo</Label>
                              {/* Removed photo preview and file upload logic */}
                            </div>

                            <div>
                              <Label>House</Label>
                              <Select 
                                value={winner.house} 
                                onValueChange={(value) => updateEditingWinner(index, 'house', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select house" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Delany">Delany</SelectItem>
                                  <SelectItem value="Gandhi">Gandhi</SelectItem>
                                  <SelectItem value="Tagore">Tagore</SelectItem>
                                  <SelectItem value="Aloysius">Aloysius</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Winner Name</Label>
                              <Input
                                value={winner.name}
                                onChange={(e) => updateEditingWinner(index, 'name', e.target.value)}
                                placeholder="Enter name or team name"
                              />
                            </div>
                            <div>
                              <Label>Points</Label>
                              <Input
                                type="number"
                                value={winner.points}
                                onChange={(e) => updateEditingWinner(index, 'points', parseInt(e.target.value))}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Events</span>
                    <Badge variant="secondary">{totalEvents}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Awards Given</span>
                    <Badge variant="secondary">{awards}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportCSV}>
                    Export Results to CSV
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Backup Database
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
