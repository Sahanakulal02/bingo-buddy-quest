import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Users, 
  Trophy, 
  Play, 
  Search,
  UserPlus,
  Clock,
  GamepadIcon
} from "lucide-react";

interface Game {
  id: string;
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: string;
  winner?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  isOnline: boolean;
}

interface GameLobbyProps {
  currentUser: User;
  onCreateGame: () => void;
  onJoinGame: (gameId: string) => void;
  onInviteUser: (userId: string) => void;
  games: Game[];
  users: User[];
}

export const GameLobby = ({ 
  currentUser, 
  onCreateGame, 
  onJoinGame, 
  onInviteUser,
  games,
  users 
}: GameLobbyProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'games' | 'users'>('games');

  const filteredUsers = users.filter(user => 
    user.id !== currentUser.id && 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeGames = games.filter(game => game.status === 'playing');
  const waitingGames = games.filter(game => game.status === 'waiting');
  const finishedGames = games.filter(game => game.status === 'finished');

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GamepadIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Bingo Lobby
          </h1>
        </div>
        <p className="text-muted-foreground">
          Welcome back, {currentUser.username}! Ready to play some Bingo?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button 
                onClick={onCreateGame}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Game
              </Button>
              <Button variant="outline" className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Find Random Match
              </Button>
            </CardContent>
          </Card>

          {/* Games Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GamepadIcon className="h-5 w-5" />
                  Active Games
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === 'games' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('games')}
                  >
                    Games
                  </Button>
                  <Button
                    variant={activeTab === 'users' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('users')}
                  >
                    Users
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTab === 'games' && (
                <>
                  {/* Waiting Games */}
                  {waitingGames.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Waiting for Players
                      </h4>
                      <div className="space-y-2">
                        {waitingGames.map((game) => (
                          <div
                            key={game.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-2">
                                {game.players.slice(0, 2).map((player, index) => (
                                  <Avatar key={index} className="h-8 w-8 border-2 border-background">
                                    <AvatarFallback className="text-xs">
                                      {player.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {game.players[0]} vs {game.players[1] || 'Waiting...'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {game.players.length}/2 players
                                </p>
                              </div>
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => onJoinGame(game.id)}
                              disabled={game.players.length >= 2}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Games */}
                  {activeGames.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Currently Playing
                      </h4>
                      <div className="space-y-2">
                        {activeGames.map((game) => (
                          <div
                            key={game.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-2">
                                {game.players.map((player, index) => (
                                  <Avatar key={index} className="h-8 w-8 border-2 border-background">
                                    <AvatarFallback className="text-xs">
                                      {player.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {game.players[0]} vs {game.players[1]}
                                </p>
                                <p className="text-sm text-muted-foreground">Game in progress</p>
                              </div>
                            </div>
                            <Badge variant="default" className="animate-pulse">
                              Live
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {waitingGames.length === 0 && activeGames.length === 0 && (
                    <div className="text-center py-8">
                      <GamepadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No active games right now</p>
                      <p className="text-sm text-muted-foreground">Create a new game to get started!</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'users' && (
                <div>
                  <div className="mb-4">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                              <span className="text-sm text-muted-foreground">
                                {user.isOnline ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onInviteUser(user.id)}
                          disabled={!user.isOnline}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Invite
                        </Button>
                      </div>
                    ))}
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No users found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarFallback className="text-lg">
                    {currentUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold">{currentUser.username}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">Games Won</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">28</p>
                  <p className="text-sm text-muted-foreground">Games Played</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Games */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              {finishedGames.slice(0, 3).map((game) => (
                <div key={game.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <span className="text-sm">vs {game.players.find(p => p !== currentUser.username)}</span>
                  </div>
                  {game.winner === currentUser.username ? (
                    <Badge variant="default" className="bg-bingo-winner text-black">Win</Badge>
                  ) : (
                    <Badge variant="secondary">Loss</Badge>
                  )}
                </div>
              ))}
              {finishedGames.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent games
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};