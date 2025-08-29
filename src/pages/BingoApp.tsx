import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { GameLobby } from "@/components/game/GameLobby";
import { GameRoom } from "@/components/game/GameRoom";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  Trophy, 
  Settings, 
  Moon, 
  Sun,
  GamepadIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  isOnline: boolean;
}

interface Game {
  id: string;
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: string;
  winner?: string;
}

interface Player {
  id: string;
  username: string;
  isReady: boolean;
  isWinner: boolean;
}

interface Notification {
  id: string;
  type: 'game_invite' | 'game_result' | 'friend_request' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  fromUser?: {
    id: string;
    username: string;
  };
  gameId?: string;
}

type AppScreen = 'auth' | 'lobby' | 'game' | 'leaderboard';
type AuthMode = 'login' | 'signup';

export const BingoApp = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('auth');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data - in real app this would come from backend
  const [users] = useState<User[]>([
    { id: "1", username: "Alice", email: "alice@example.com", isOnline: true },
    { id: "2", username: "Bob", email: "bob@example.com", isOnline: false },
    { id: "3", username: "Charlie", email: "charlie@example.com", isOnline: true },
    { id: "4", username: "Diana", email: "diana@example.com", isOnline: true }
  ]);

  const [games] = useState<Game[]>([
    { 
      id: "game1", 
      players: ["Alice", "Bob"], 
      status: 'playing', 
      createdAt: "2024-01-15T10:00:00Z"
    },
    { 
      id: "game2", 
      players: ["Charlie"], 
      status: 'waiting', 
      createdAt: "2024-01-15T10:30:00Z"
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: 'game_invite',
      title: "Game Invitation",
      message: "Alice invited you to play Bingo",
      timestamp: "2024-01-15T10:00:00Z",
      read: false,
      actionable: true,
      fromUser: { id: "1", username: "Alice" },
      gameId: "game1"
    },
    {
      id: "2",
      type: 'achievement',
      title: "Achievement Unlocked!",
      message: "You won your 10th game! 🎉",
      timestamp: "2024-01-15T09:30:00Z",
      read: false
    }
  ]);

  // Mock game room data
  const mockPlayers: Player[] = [
    { id: "1", username: currentUser?.username || "You", isReady: true, isWinner: false },
    { id: "2", username: "Alice", isReady: true, isWinner: false }
  ];

  const [calledNumbers] = useState<number[]>([12, 25, 38, 47, 61, 8, 19, 33, 52, 67]);
  const [currentNumber] = useState<number>(67);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleLogin = async (email: string, password: string) => {
    // Mock login - in real app this would authenticate with backend
    const mockUser: User = {
      id: "current-user",
      username: email.split('@')[0],
      email,
      isOnline: true
    };
    
    setCurrentUser(mockUser);
    setCurrentScreen('lobby');
    
    toast({
      title: "Welcome back!",
      description: `Logged in as ${mockUser.username}`,
    });
  };

  const handleSignup = async (email: string, password: string, username: string) => {
    // Mock signup - in real app this would create user in backend
    const mockUser: User = {
      id: "current-user",
      username,
      email,
      isOnline: true
    };
    
    setCurrentUser(mockUser);
    setCurrentScreen('lobby');
    
    toast({
      title: "Account created!",
      description: `Welcome to Bingo Buddy Quest, ${username}!`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('auth');
    setAuthMode('login');
    
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const handleCreateGame = () => {
    const gameId = `game-${Date.now()}`;
    setCurrentGameId(gameId);
    setCurrentScreen('game');
    
    toast({
      title: "Game created!",
      description: "Waiting for another player to join...",
    });
  };

  const handleJoinGame = (gameId: string) => {
    setCurrentGameId(gameId);
    setCurrentScreen('game');
    
    toast({
      title: "Joined game!",
      description: "Get ready to play Bingo!",
    });
  };

  const handleInviteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Invitation sent!",
        description: `Invited ${user.username} to play`,
      });
    }
  };

  const handleAcceptInvite = (gameId: string) => {
    setCurrentGameId(gameId);
    setCurrentScreen('game');
    
    // Mark notification as read
    setNotifications(prev => 
      prev.map(n => 
        n.gameId === gameId ? { ...n, read: true } : n
      )
    );
    
    toast({
      title: "Game joined!",
      description: "Starting the game...",
    });
  };

  const handleDeclineInvite = (gameId: string) => {
    // Remove notification
    setNotifications(prev => prev.filter(n => n.gameId !== gameId));
    
    toast({
      title: "Invitation declined",
      description: "Maybe next time!",
    });
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleLeaveGame = () => {
    setCurrentGameId(null);
    setCurrentScreen('lobby');
    
    toast({
      title: "Left game",
      description: "Returned to lobby",
    });
  };

  // Auth screens
  if (currentScreen === 'auth') {
    if (authMode === 'login') {
      return (
        <LoginForm
          onSwitchToSignup={() => setAuthMode('signup')}
          onLogin={handleLogin}
        />
      );
    } else {
      return (
        <SignupForm
          onSwitchToLogin={() => setAuthMode('login')}
          onSignup={handleSignup}
        />
      );
    }
  }

  // Main app with navigation
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GamepadIcon className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Bingo Buddy Quest
              </h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2 ml-8">
              <Button
                variant={currentScreen === 'lobby' ? 'default' : 'ghost'}
                onClick={() => setCurrentScreen('lobby')}
              >
                Lobby
              </Button>
              <Button
                variant={currentScreen === 'leaderboard' ? 'default' : 'ghost'}
                onClick={() => setCurrentScreen('leaderboard')}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationPanel
              notifications={notifications}
              onAcceptInvite={handleAcceptInvite}
              onDeclineInvite={handleDeclineInvite}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAllNotifications}
            />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {currentUser?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline font-medium">{currentUser?.username}</span>
              <Badge variant="secondary" className="hidden md:inline">
                Online
              </Badge>
            </div>

            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentScreen === 'lobby' && currentUser && (
          <GameLobby
            currentUser={currentUser}
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
            onInviteUser={handleInviteUser}
            games={games}
            users={users}
          />
        )}

        {currentScreen === 'game' && currentUser && currentGameId && (
          <GameRoom
            gameId={currentGameId}
            currentUser={currentUser}
            players={mockPlayers}
            onLeaveGame={handleLeaveGame}
            onStartGame={() => toast({ title: "Game started!", description: "Let's play Bingo!" })}
            isGameStarted={true}
            currentNumber={currentNumber}
            calledNumbers={calledNumbers}
            gameStatus="playing"
          />
        )}

        {currentScreen === 'leaderboard' && (
          <Leaderboard onBack={() => setCurrentScreen('lobby')} />
        )}
      </main>
    </div>
  );
};