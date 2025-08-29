import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp,
  Calendar,
  Users,
  Target,
  ArrowLeft
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  username: string;
  gamesWon: number;
  gamesPlayed: number;
  winRate: number;
  score: number;
  streak: number;
  lastActive: string;
}

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard = ({ onBack }: LeaderboardProps) => {
  const [activeTab, setActiveTab] = useState("overall");

  // Mock data - in real app this would come from backend
  const mockData: LeaderboardEntry[] = [
    {
      id: "1",
      username: "BingoMaster",
      gamesWon: 47,
      gamesPlayed: 52,
      winRate: 90.4,
      score: 2850,
      streak: 8,
      lastActive: "2024-01-15"
    },
    {
      id: "2", 
      username: "NumberCruncher",
      gamesWon: 38,
      gamesPlayed: 45,
      winRate: 84.4,
      score: 2340,
      streak: 5,
      lastActive: "2024-01-15"
    },
    {
      id: "3",
      username: "BingoQueen",
      gamesWon: 35,
      gamesPlayed: 42,
      winRate: 83.3,
      score: 2190,
      streak: 12,
      lastActive: "2024-01-14"
    },
    {
      id: "4",
      username: "LuckyPlayer",
      gamesWon: 28,
      gamesPlayed: 38,
      winRate: 73.7,
      score: 1890,
      streak: 3,
      lastActive: "2024-01-13"
    },
    {
      id: "5",
      username: "GameLover",
      gamesWon: 24,
      gamesPlayed: 35,
      winRate: 68.6,
      score: 1620,
      streak: 0,
      lastActive: "2024-01-12"
    }
  ];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <div className="h-6 w-6 flex items-center justify-center text-lg font-bold text-muted-foreground">#{position}</div>;
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">Champion</Badge>;
      case 2:
        return <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-black">Runner-up</Badge>;
      case 3:
        return <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black">3rd Place</Badge>;
      default:
        return null;
    }
  };

  const LeaderboardTable = ({ data, title, timeframe }: { data: LeaderboardEntry[], title: string, timeframe: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-muted-foreground">{timeframe}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((entry, index) => (
            <div
              key={entry.id}
              className={`
                flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-muted/50
                ${index < 3 ? 'bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20' : 'bg-muted/20'}
              `}
            >
              <div className="flex-shrink-0">
                {getRankIcon(index + 1)}
              </div>
              
              <Avatar className="h-12 w-12">
                <AvatarFallback className="font-semibold">
                  {entry.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{entry.username}</h3>
                  {getRankBadge(index + 1)}
                  {entry.streak > 0 && (
                    <Badge variant="outline" className="text-xs">
                      🔥 {entry.streak}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{entry.gamesWon}W / {entry.gamesPlayed}P</span>
                  <span>{entry.winRate.toFixed(1)}% Win Rate</span>
                  <span>{entry.score.toLocaleString()} pts</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  #{index + 1}
                </div>
                <div className="text-sm text-muted-foreground">
                  {entry.score.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lobby
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">See how you rank against other players</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Total Players</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">8,923</p>
                <p className="text-sm text-muted-foreground">Games Played</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">73.4%</p>
                <p className="text-sm text-muted-foreground">Avg Win Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">BingoMaster</p>
                <p className="text-sm text-muted-foreground">Top Player</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overall" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Overall
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            This Month
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            This Week
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-6">
          <LeaderboardTable 
            data={mockData} 
            title="Overall Leaderboard" 
            timeframe="All time rankings based on total score and performance"
          />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <LeaderboardTable 
            data={mockData.sort((a, b) => b.winRate - a.winRate)} 
            title="Monthly Champions" 
            timeframe="January 2024 rankings"
          />
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <LeaderboardTable 
            data={mockData.sort((a, b) => b.streak - a.streak)} 
            title="Weekly Leaders" 
            timeframe="Week of January 8-14, 2024"
          />
        </TabsContent>
      </Tabs>

      {/* Your Rank */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Current Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                #42
              </div>
            </div>
            
            <Avatar className="h-12 w-12">
              <AvatarFallback className="font-semibold">
                YU
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">Your Username</h3>
                <Badge variant="outline">Rising Star</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>12W / 28P</span>
                <span>42.9% Win Rate</span>
                <span>890 pts</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                Rank #42
              </div>
              <div className="text-sm text-muted-foreground">
                +8 this week
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};