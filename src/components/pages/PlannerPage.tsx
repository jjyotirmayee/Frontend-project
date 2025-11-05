import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar, Plus, Clock, BookOpen, Target } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export function PlannerPage() {
  const { exams, addExam, subjects } = useApp();
  const [isAddingExam, setIsAddingExam] = useState(false);
  
  const [newExam, setNewExam] = useState({
    subject: '',
    date: '',
    time: '',
    type: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExam.subject || !newExam.date || !newExam.time || !newExam.type) {
      toast.error('Please fill in all fields');
      return;
    }
    
    addExam(newExam);
    setNewExam({
      subject: '',
      date: '',
      time: '',
      type: '',
      priority: 'medium'
    });
    setIsAddingExam(false);
    toast.success('Exam added successfully!');
  };

  const upcomingExams = exams
    .filter(exam => new Date(exam.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastExams = exams
    .filter(exam => new Date(exam.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200"
  };

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Planner</h1>
          <p className="text-muted-foreground mt-2">
            Organize your study schedule and track upcoming exams
          </p>
        </div>
        
        <Dialog open={isAddingExam} onOpenChange={setIsAddingExam}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Exam
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Exam</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExam} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={newExam.subject} onValueChange={(value) => setNewExam(prev => ({ ...prev, subject: value }))}>
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    min={todayDate}
                    value={newExam.date}
                    onChange={(e) => setNewExam(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newExam.time}
                    onChange={(e) => setNewExam(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Exam Type</Label>
                <Input
                  id="type"
                  placeholder="e.g., Midterm, Final, Quiz, Assignment"
                  value={newExam.type}
                  onChange={(e) => setNewExam(prev => ({ ...prev, type: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newExam.priority} onValueChange={(value) => setNewExam(prev => ({ ...prev, priority: value as 'high' | 'medium' | 'low' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddingExam(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Exam</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Exams ({upcomingExams.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming exams scheduled</p>
                <p className="text-sm">Add your first exam to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{exam.subject}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(exam.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exam.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${priorityColors[exam.priority]}`}>
                        {exam.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              This Week's Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-medium">Study 25 hours</span>
                </div>
                <span className="text-sm text-muted-foreground">18/25 hours</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium">Complete 3 practice tests</span>
                </div>
                <span className="text-sm text-muted-foreground">2/3 completed</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-medium">Review 5 topics</span>
                </div>
                <span className="text-sm text-muted-foreground">3/5 reviewed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Past Exams */}
        {pastExams.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Past Exams ({pastExams.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-4 border rounded-lg opacity-75"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{exam.subject}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(exam.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exam.time}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs font-medium">
                      {exam.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}