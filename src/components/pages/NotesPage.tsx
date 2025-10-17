import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StickyNote, Plus, Edit3, Trash2, Calendar, Tag, Brain, Wifi, Cpu, BookOpen, Layers } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);

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
      case "Data Structure & Algorithms": return "#60a5fa"; // lighter blue
      case "Computer Networks": return "#34d399"; // lighter green
      case "Operating Systems": return "#fcd34d"; // lighter yellow
      case "Theory of Computation": return "#a78bfa"; // lighter purple
      case "Computer Organization & Architecture": return "#f87171"; // lighter red
      default: return "#60a5fa";
    }
  };

  const getNotesBySubject = (subject: string) => notes.filter(note => note.subject === subject);

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    toast.success('Note deleted successfully!');
  };

  const startEditNote = (note: any) => {
    setEditingNote(note.id);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-600 drop-shadow-lg underline decoration-indigo-400 underline-offset-4">
            Study Notes
          </h1>
          <p className="text-gray-600 mt-0.5 italic">📝 Your personal study companion</p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {subjects.map((subject) => {
          const subjectNotes = getNotesBySubject(subject.name);
          const bgColor = getBackgroundColor(subject.name);
          const icon = iconMap[subject.icon] || <Brain className="w-4 h-4 text-white" />;

          return (
            <div key={subject.id} className="flex flex-col space-y-2 min-w-[230px]">
              {/* Subject Box */}
              <div className="flex items-center gap-2 p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-md" style={{ backgroundColor: bgColor }}>
                {icon}
                <h2 className="text-base font-extrabold text-white">{subject.name}</h2>
              </div>

              {/* Notes or No Notes */}
              {subjectNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-4 shadow-md rounded-md" style={{ backgroundColor: bgColor }}>
                  <StickyNote className="w-6 h-6 text-white animate-bounce mb-1" />
                  <h3 className="text-xs font-extrabold text-white mb-1">No notes yet</h3>
                  <p className="text-white text-center text-[11px] mb-2 italic">Start adding your notes!</p>
                  <Button variant="outline" size="xs" className="flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Note
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {subjectNotes.map((note) => (
                    <Card key={note.id} className="hover:shadow-xl transition-shadow p-3 rounded-lg">
                      <CardHeader className="pb-1">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xs font-bold line-clamp-2 text-gray-800">{note.title}</CardTitle>
                          <div className="flex items-center gap-1 ml-1">
                            <Button variant="ghost" size="icon" onClick={() => startEditNote(note)}><Edit3 className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-1">
                        <p className="text-[10px] italic font-semibold text-gray-700 mb-1 line-clamp-3">{note.content}</p>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {note.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[9px] flex items-center gap-1 font-semibold">
                                <Tag className="w-2 h-2" />{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                          <Calendar className="w-3 h-3" /><span>{formatDate(note.createdAt)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
