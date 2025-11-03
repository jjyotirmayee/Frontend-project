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
  Layers
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner';

export function NotesPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const [newNote, setNewNote] = useState({ title: '', content: '', subject: '', tags: '' });
  const [editNote, setEditNote] = useState({ title: '', content: '', subject: '', tags: '' });

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
        const data = [
          { id: '1', name: 'Data Structure & Algorithms', icon: 'brain' },
          { id: '2', name: 'Computer Networks', icon: 'wifi' },
          { id: '3', name: 'Operating Systems', icon: 'cpu' },
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
    const tags = newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    addNote({ ...newNote, tags });
    setNewNote({ title: '', content: '', subject: '', tags: '' });
    setIsAddingNote(false);
    toast.success('Note added successfully!');
  };

  const handleEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    const tags = editNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
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
                <Input id="title" placeholder="Enter note title" value={newNote.title} onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))} required size="sm" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="subject" className="text-sm font-bold">Subject</Label>
                <Select value={newNote.subject} onValueChange={(value) => setNewNote(prev => ({ ...prev, subject: value }))}>
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
                <Input id="tags" placeholder="e.g., algorithms, important" value={newNote.tags} onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))} size="sm" />
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
            
            // Navigate to subject-specific study page (to be created later)
            // window.location.href = `/study/${encodeURIComponent(subject.name)}`;
            onClick={() => onNavigate && onNavigate('quickrevision')}
            
          >
            Let’s Study More →
          </Button>
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
}
