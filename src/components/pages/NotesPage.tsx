import { useState } from 'react';
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
  Search, 
  Edit3, 
  Trash2, 
  BookOpen,
  Calendar,
  Tag
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, subjects } = useApp();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    subject: '',
    tags: ''
  });

  const [editNote, setEditNote] = useState({
    title: '',
    content: '',
    subject: '',
    tags: ''
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.title || !newNote.content || !newNote.subject) {
      toast.error('Please fill in title, content, and subject');
      return;
    }
    
    const tags = newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    addNote({
      title: newNote.title,
      content: newNote.content,
      subject: newNote.subject,
      tags
    });
    
    setNewNote({ title: '', content: '', subject: '', tags: '' });
    setIsAddingNote(false);
    toast.success('Note added successfully!');
  };

  const handleEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingNote) return;
    
    const tags = editNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    updateNote(editingNote, {
      title: editNote.title,
      content: editNote.content,
      subject: editNote.subject,
      tags
    });
    
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
    setEditNote({
      title: note.title,
      content: note.content,
      subject: note.subject,
      tags: note.tags.join(', ')
    });
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = filterSubject === 'all' || note.subject === filterSubject;
    
    return matchesSearch && matchesSubject;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Notes</h1>
          <p className="text-muted-foreground mt-2">
            Create and organize your study notes
          </p>
        </div>
        
        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddNote} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={newNote.subject} onValueChange={(value) => setNewNote(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your notes here..."
                  className="min-h-[200px]"
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., algorithms, important, review"
                  value={newNote.tags}
                  onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddingNote(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Note</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search notes, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.name}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <StickyNote className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No notes found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterSubject !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first note to get started!'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditNote(note)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-3 h-3" />
                  <span>{note.subject}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {note.content}
                </p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Note Dialog */}
      <Dialog open={editingNote !== null} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditNote} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editNote.title}
                onChange={(e) => setEditNote(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Select value={editNote.subject} onValueChange={(value) => setEditNote(prev => ({ ...prev, subject: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                className="min-h-[200px]"
                value={editNote.content}
                onChange={(e) => setEditNote(prev => ({ ...prev, content: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={editNote.tags}
                onChange={(e) => setEditNote(prev => ({ ...prev, tags: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingNote(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Note</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}