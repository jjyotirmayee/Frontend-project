import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Download,
  Upload,
  Trash2,
  Plus,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { subjects, addSubject, updateSubject, deleteSubject } = useApp();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate student focused on technology and innovation.'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    studyReminders: true,
    examAlerts: true,
    weeklyReports: false
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    studyGoal: '5'
  });

  const [newSubject, setNewSubject] = useState({ name: '', color: '#8b7cf8' });
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name) {
      toast.error('Please enter a subject name');
      return;
    }
    
    addSubject({
      name: newSubject.name,
      color: newSubject.color,
      progress: 0,
      totalHours: 40,
      studiedHours: 0
    });
    
    setNewSubject({ name: '', color: '#8b7cf8' });
    setIsAddingSubject(false);
    toast.success('Subject added successfully!');
  };

  const handleDeleteSubject = (subjectId: string) => {
    deleteSubject(subjectId);
    toast.success('Subject deleted successfully!');
  };

  const predefinedColors = [
    '#8b7cf8', '#60a5fa', '#34d399', '#fbbf24', '#f87171',
    '#a78bfa', '#fb7185', '#38d9a9', '#ffcc02', '#ff8c42'
  ];

  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (preferences.theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light', 'dark');
    }
  }, [preferences.theme]);

  // Fixed implicit 'any' type errors for parameters

  // Updated helper functions
  const handleCheckedChange = (checked: boolean, key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: checked }));
  };

  const handleValueChange = (value: string, key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Updated usage
  const handleEmailNotificationChange = (checked: boolean) => {
    setNotifications(prev => ({ ...prev, emailNotifications: checked }));
    if (checked) {
      toast.success('Email notifications enabled');
    } else {
      toast.info('Email notifications disabled');
    }
  };

  // Added functionality for study reminders and exam alerts
  const handleStudyRemindersChange = (checked: boolean) => {
    setNotifications(prev => ({ ...prev, studyReminders: checked }));
    if (checked) {
      toast.success('Study reminders enabled');
    } else {
      toast.info('Study reminders disabled');
    }
  };

  const handleExamAlertsChange = (checked: boolean) => {
    setNotifications(prev => ({ ...prev, examAlerts: checked }));
    if (checked) {
      toast.success('Exam alerts enabled');
    } else {
      toast.info('Exam alerts disabled');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
                
                <Button type="submit">Update Profile</Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive study updates via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={handleEmailNotificationChange}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Get notifications on your device</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked: boolean) => handleCheckedChange(checked, 'pushNotifications')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Study Reminders</h4>
                  <p className="text-sm text-muted-foreground">Reminders for scheduled study sessions</p>
                </div>
                <Switch
                  checked={notifications.studyReminders}
                  onCheckedChange={handleStudyRemindersChange}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Exam Alerts</h4>
                  <p className="text-sm text-muted-foreground">Alerts for upcoming exams</p>
                </div>
                <Switch
                  checked={notifications.examAlerts}
                  onCheckedChange={handleExamAlertsChange}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weekly Reports</h4>
                  <p className="text-sm text-muted-foreground">Weekly progress summary emails</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => handleCheckedChange(checked, 'weeklyReports')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value: string) => handleValueChange(value, 'theme')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => handleValueChange(value, 'language')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="or">Odia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => handleValueChange(value, 'timezone')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="studyGoal">Daily Study Goal (hours)</Label>
                  <Select value={preferences.studyGoal} onValueChange={(value) => handleValueChange(value, 'studyGoal')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="5">5 hours</SelectItem>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subjects Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Manage Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSubject(subject.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {isAddingSubject ? (
                <form onSubmit={handleAddSubject} className="space-y-3 p-3 border rounded-lg bg-accent/30">
                  <Input
                    placeholder="Subject name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <div className="flex gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-6 h-6 rounded-full border-2 ${newSubject.color === color ? 'border-gray-900' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewSubject(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">Add</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingSubject(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsAddingSubject(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
              
              <Separator />
              
              <Button variant="destructive" className="w-full" onClick={logout}>
                <Trash2 className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardHeader>
              <CardTitle>App Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Version</span>
                <Badge variant="secondary">v1.0.0</Badge>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span className="text-muted-foreground">Sep 7, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Used</span>
                <span className="text-muted-foreground">2.4 MB</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}