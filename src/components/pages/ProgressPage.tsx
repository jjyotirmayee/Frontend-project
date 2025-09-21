import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  BookOpen,
  Award,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

export function ProgressPage() {
  const { subjects, goals } = useApp();

  // Mock weekly progress data
  const weeklyProgress = [
    { day: 'Mon', hours: 4, tests: 1, notes: 2 },
    { day: 'Tue', hours: 6, tests: 2, notes: 3 },
    { day: 'Wed', hours: 3, tests: 0, notes: 1 },
    { day: 'Thu', hours: 5, tests: 1, notes: 4 },
    { day: 'Fri', hours: 4, tests: 3, notes: 2 },
    { day: 'Sat', hours: 7, tests: 2, notes: 5 },
    { day: 'Sun', hours: 5, tests: 1, notes: 3 }
  ];

  // Mock monthly data
  const monthlyData = [
    { month: 'Jan', hours: 120, score: 75 },
    { month: 'Feb', hours: 135, score: 78 },
    { month: 'Mar', hours: 142, score: 82 },
    { month: 'Apr', hours: 158, score: 85 },
    { month: 'May', hours: 165, score: 87 },
    { month: 'Jun', hours: 172, score: 89 },
    { month: 'Jul', hours: 180, score: 91 },
    { month: 'Aug', hours: 175, score: 88 },
    { month: 'Sep', hours: 34, score: 92 }
  ];

  // Subject performance data for pie chart
  const subjectData = subjects.map(subject => ({
    name: subject.name,
    value: subject.progress,
    color: subject.color
  }));

  const totalStudyHours = subjects.reduce((sum, subject) => sum + subject.studiedHours, 0);
  const totalTargetHours = subjects.reduce((sum, subject) => sum + subject.totalHours, 0);
  const overallProgress = Math.round((totalStudyHours / totalTargetHours) * 100);

  const completedGoals = goals.filter(goal => goal.completed).length;
  const averageGoalProgress = Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progress Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Study Hours</p>
                <p className="text-2xl font-bold">{Math.round(totalStudyHours)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{overallProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goals Completed</p>
                <p className="text-2xl font-bold">{completedGoals}/{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Goal Progress</p>
                <p className="text-2xl font-bold">{averageGoalProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Subject Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjects.map((subject) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{subject.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {subject.studiedHours}h / {subject.totalHours}h
                    </span>
                  </div>
                  <Progress value={subject.progress} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{subject.progress}% completed</span>
                    <Badge 
                      variant="secondary" 
                      style={{ backgroundColor: `${subject.color}20`, color: subject.color }}
                    >
                      {subject.progress >= 80 ? 'Excellent' : subject.progress >= 60 ? 'Good' : 'Needs Focus'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Study Time Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Progress"]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {subjectData.map((subject) => (
                <div key={subject.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="text-sm text-muted-foreground">{subject.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              This Week's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'hours' ? 'Study Hours' : name === 'tests' ? 'Tests Taken' : 'Notes Created']}
                    labelStyle={{ color: "#2d2b3a" }}
                  />
                  <Bar dataKey="hours" fill="#8b7cf8" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'hours' ? 'Study Hours' : 'Average Score']}
                    labelStyle={{ color: "#2d2b3a" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#8b7cf8" 
                    strokeWidth={3}
                    dot={{ fill: "#8b7cf8", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#60a5fa" 
                    strokeWidth={3}
                    dot={{ fill: "#60a5fa", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                  </div>
                  {goal.completed && (
                    <Badge className="bg-green-100 text-green-700">
                      Completed
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                
                <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}