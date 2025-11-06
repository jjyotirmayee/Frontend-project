import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { 
  StickyNote, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  Tag,
  Brain,
  Wifi,
  Cpu,
  BookOpen,
  Layers,
  X
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner';

export function NotesPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const [newNote, setNewNote] = useState({ title: '', content: '', subject: '', tags: '' });
  const [editNote, setEditNote] = useState<any>({ title: '', content: '', subject: '', tags: '' });
  
  // State for fetched notes from Django API
  const [fetchedNotes, setFetchedNotes] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);

  const iconMap: any = {
    brain: <Brain className="w-4 h-4 text-white" />,
    wifi: <Wifi className="w-4 h-4 text-white" />,
    cpu: <Cpu className="w-4 h-4 text-white" />,
    "book-open": <BookOpen className="w-4 h-4 text-white" />,
    layers: <Layers className="w-4 h-4 text-white" />,
  };

  useEffect(() => {
    async function fetchSubjects() {
      try {
        // Uncomment below line when backend is ready
        // const res = await fetch('/api/subjects'); 
        // const data = await res.json();

        // Mock subjects for now
        // API expects: "1" for OS, "2" for CN, "3" for DSA, "4" for TOC, "5" for COA
        const data = [
          { id: '3', name: 'Data Structure & Algorithms', icon: 'brain' },
          { id: '2', name: 'Computer Networks', icon: 'wifi' },
          { id: '1', name: 'Operating Systems', icon: 'cpu' },
          { id: '4', name: 'Theory of Computation', icon: 'book-open' },
          { id: '5', name: 'Computer Organization & Architecture', icon: 'layers' }
        ];

        setSubjects(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch subjects');
      }
    }
    fetchSubjects();
  }, []);

  // Fetch notes from Django API when a topic is selected
  useEffect(() => {
    if (selectedTopic) {
      fetchNotesFromAPI(selectedTopic.id);
    }
  }, [selectedTopic]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showNotesDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showNotesDialog]);

  const fetchNotesFromAPI = async (topicId: string) => {
    setIsLoadingNotes(true);
    try {
      const response = await fetch(`http://localhost:8000/api/notes/${topicId}/`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to fetch notes: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle the new API response format and split into lines for bullet points
      let notesArray: string[] = [];
      
      if (data.success && data.notes && Array.isArray(data.notes) && data.notes.length > 0) {
        // Get the full content and split by lines
        notesArray = data.notes.flatMap((noteObj: any) => {
          if (noteObj.content && typeof noteObj.content === 'string') {
            // Split by newlines and filter out empty lines
            return noteObj.content
              .split('\n')
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0);
          }
          return [];
        });
      }
      
      setFetchedNotes(notesArray);
      setShowNotesDialog(true);
      
      if (notesArray.length > 0) {
        toast.success('Notes loaded successfully!');
      } else {
        toast.info('No notes available yet for this topic.');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notes from API';
      toast.error(errorMessage);
      setFetchedNotes([]);
      setShowNotesDialog(true); // Still show dialog with error message
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleStudyMore = (subject: any) => {
    setSelectedTopic(subject);
  };

  const getBackgroundColor = (subjectName: string) => {
    switch (subjectName) {
      case "Data Structure & Algorithms": return "#84b0e6ff"; 
      case "Computer Networks": return "#4ba182ff"; 
      case "Operating Systems": return "#aec23bff"; 
      case "Theory of Computation": return "#a799cfff"; 
      case "Computer Organization & Architecture": return "#c28282ff"; 
      default: return "#94b9e6ff";
    }
  };

  const getNotesBySubject = (subject: string) => notes.filter(note => note.subject === subject);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content || !newNote.subject) {
      toast.error('Please fill in title, content, and subject');
      return;
    }
    const tags = newNote.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    addNote({ ...newNote, tags });
    setNewNote({ title: '', content: '', subject: '', tags: '' });
    setIsAddingNote(false);
    toast.success('Note added successfully!');
  };

  const handleEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    const tags = editNote.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    updateNote(editNote.id || editingNote, { ...editNote, tags });
    setEditingNote(null);
    setEditNote({ title: '', content: '', subject: '', tags: '' });
    toast.success('Note updated successfully!');
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    toast.success('Note deleted successfully!');
  };

  const startEditNote = (note: any) => {
    setEditingNote(note.id);
    setEditNote({ ...note, tags: note.tags.join(', ') });
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-600 drop-shadow-md underline decoration-indigo-400 underline-offset-4">
            Study Notes
          </h1>
          <p className="text-gray-600 mt-0.5 italic">📝 Your personal study companion</p>
        </div>

        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-800 drop-shadow-sm">Create New Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddNote} className="space-y-3 mt-3">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-sm font-bold">Title</Label>
                <Input id="title" placeholder="Enter note title" value={newNote.title} onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))} required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="subject" className="text-sm font-bold">Subject</Label>
                <Select value={newNote.subject} onValueChange={(value: string) => setNewNote(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="content" className="text-sm font-bold">Content</Label>
                <Textarea id="content" placeholder="Write your notes here..." className="min-h-[150px] text-sm" value={newNote.content} onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))} required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tags" className="text-sm font-bold">Tags (comma-separated)</Label>
                <Input id="tags" placeholder="e.g., algorithms, important" value={newNote.tags} onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm">Cancel</Button>
                <Button type="submit" size="sm">Create Note</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

    {/* Subjects Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {subjects.map((subject, index) => {
    const bgColor = getBackgroundColor(subject.name);
    const icon = iconMap[subject.icon] || <Brain className="w-4 h-4 text-white" />;

    // Catchy line examples (you can customize per subject)
    const catchyLines: Record<string, string> = {
      "Data Structure & Algorithms": "Crack the logic, master the structure 🧠",
      "Computer Networks": "Let’s dive into packets & protocols 🌐",
      "Operating Systems": "Unlock the secrets of multitasking ⚙️",
      "Theory of Computation": "Explore the limits of what machines can compute 💡",
      "Computer Organization & Architecture": "Understand how hardware thinks 🔩",
    };

    return (
      <div
        key={subject.id}
        className="flex flex-col justify-between p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
        style={{ backgroundColor: bgColor, minHeight: '180px' }}
      >
        {/* Subject Header */}
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h2 className="text-lg font-extrabold text-white">{subject.name}</h2>
        </div>

        {/* Catchy Line */}
        <p className="text-sm text-white italic mb-4 opacity-90">
          {catchyLines[subject.name] || "Let’s study and grow smarter 📚"}
        </p>

        {/* "Let's Study More" Button */}
        <div className="flex justify-end">
          <Button
            size="sm"
            className="bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-all"
            onClick={() => handleStudyMore(subject)}
            disabled={isLoadingNotes && selectedTopic?.id === subject.id}
          >
            {isLoadingNotes && selectedTopic?.id === subject.id ? 'Loading...' : "Let's Study More →"}
          </Button>
        </div>
      </div>
    );
  })}
</div>

      {/* Enhanced Study Notes Modal - Dark Mode Compatible */}
      {showNotesDialog && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 dark:bg-black/90 backdrop-blur-md"
        >
          {/* modal container */}
          <div
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-gray-300 dark:border-gray-700 w-[90vw] max-w-4xl flex flex-col"
            style={{ 
              maxHeight: '80vh',
              padding: '2.5rem',
              margin: '3rem 2rem',
              backgroundColor: document.documentElement.classList.contains('dark') 
                ? 'rgb(17, 24, 39)' 
                : 'rgb(255, 255, 255)',
            }}
          >
            {/* header */}
            <div className="flex justify-between items-start mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 inline-block border-b-4 border-violet-500 dark:border-violet-400 pb-1 mb-3">
                  {selectedTopic?.name} – Study Notes
                </h2>
                {!isLoadingNotes && fetchedNotes.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    {fetchedNotes.length} notes loaded • {fetchedNotes.join('\n').length} characters
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowNotesDialog(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-3xl font-bold leading-none transform hover:scale-110 transition-all duration-200 ml-4"
                aria-label="Close"
                style={{ lineHeight: '1' }}
              >
                ×
              </button>
            </div>

            {/* notes content - scrollable */}
            <div 
              className="notes-scrollable text-gray-900 dark:text-gray-200 leading-relaxed border-l-2 border-violet-200 dark:border-violet-700 pl-4"
              style={{ 
                overflowY: 'auto',
                flex: '1 1 0%',
                minHeight: 0
              }}
            >
              {isLoadingNotes ? (
                <div className="flex items-center justify-center h-full py-12">
                  <div className="text-center">
                    <div className="inline-block w-10 h-10 border-4 border-violet-200 dark:border-violet-700 border-t-violet-600 dark:border-t-violet-400 rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-800 dark:text-gray-300 text-base">Loading notes...</p>
                  </div>
                </div>
              ) : fetchedNotes.length > 0 ? (
                <ul className="space-y-2 pr-4">
                  {fetchedNotes.map((note, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-violet-600 dark:text-violet-400 font-bold flex-shrink-0">•</span>
                      <span className="flex-1 text-gray-900 dark:text-gray-200">{note}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">No notes available yet.</p>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="flex justify-end pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowNotesDialog(false)}
                className="bg-violet-600 dark:bg-violet-500 text-white px-8 py-3 rounded-xl hover:bg-violet-700 dark:hover:bg-violet-600 font-semibold text-base transition-colors shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles - Dark Mode Compatible */}
      <style>{`
        .notes-scrollable {
          overflow-y: auto !important;
          scroll-behavior: smooth !important;
          scrollbar-width: thin !important;
          scrollbar-color: #9333ea #f3e8ff !important;
        }
        
        /* Dark mode scrollbar */
        .dark .notes-scrollable {
          scrollbar-color: #a78bfa #374151 !important;
        }
        
        .notes-scrollable::-webkit-scrollbar {
          width: 8px !important;
        }
        .notes-scrollable::-webkit-scrollbar-track {
          background: #f3e8ff !important;
          border-radius: 10px !important;
        }
        
        /* Dark mode webkit scrollbar track */
        .dark .notes-scrollable::-webkit-scrollbar-track {
          background: #374151 !important;
        }
        
        .notes-scrollable::-webkit-scrollbar-thumb {
          background: #9333ea !important;
          border-radius: 10px !important;
        }
        
        /* Dark mode webkit scrollbar thumb */
        .dark .notes-scrollable::-webkit-scrollbar-thumb {
          background: #a78bfa !important;
        }
        
        .notes-scrollable::-webkit-scrollbar-thumb:hover {
          background: #7e22ce !important;
        }
        
        /* Dark mode webkit scrollbar thumb hover */
        .dark .notes-scrollable::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6 !important;
        }
        
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
      `}</style>

    </div>
  );
}
