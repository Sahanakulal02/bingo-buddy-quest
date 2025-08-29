import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BingoBoard } from "./BingoBoard";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  Timer,
  Volume2,
  VolumeX,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: string;
  username: string;
  isReady: boolean;
  isWinner: boolean;
}

interface GameRoomProps {
  gameId: string;
  currentUser: { id: string; username: string; };
  players: Player[];
  onLeaveGame: () => void;
  onStartGame?: () => void;
  isGameStarted: boolean;
  currentNumber?: number;
  calledNumbers: number[];
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner?: Player;
}

export const GameRoom = ({
  gameId,
  currentUser,
  players,
  onLeaveGame,
  onStartGame,
  isGameStarted,
  currentNumber,
  calledNumbers,
  gameStatus,
  winner
}: GameRoomProps) => {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [gameTimer, setGameTimer] = useState(0);
  const { toast } = useToast();

  const isHost = players[0]?.id === currentUser.id;
  const canStartGame = players.length >= 2 && players.every(p => p.isReady) && !isGameStarted;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameStarted && gameStatus === 'playing') {
      interval = setInterval(() => {
        setGameTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameStarted, gameStatus]);

  useEffect(() => {
    if (currentNumber && isSoundEnabled) {
      // Play sound effect for called number
      const audio = new Audio('/bingo-call.mp3');
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    }
  }, [currentNumber, isSoundEnabled]);

  const handleWin = () => {
    toast({
      title: "🎉 BINGO!",
      description: "Congratulations! You got BINGO!",
      variant: "default",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBingoLetter = (number: number) => {
    if (number >= 1 && number <= 15) return 'B';
    if (number >= 16 && number <= 30) return 'I';
    if (number >= 31 && number <= 45) return 'N';
    if (number >= 46 && number <= 60) return 'G';
    if (number >= 61 && number <= 75) return 'O';
    return '';
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onLeaveGame}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Leave Game
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Game Room</h1>
            <p className="text-muted-foreground">Game ID: {gameId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {gameStatus === 'playing' && (
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <Timer className="h-4 w-4" />
              <span className="font-mono">{formatTime(gameTimer)}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {gameStatus === 'finished' && winner && (
        <Card className="mb-6 bg-gradient-to-r from-bingo-winner/20 to-accent/20 border-bingo-winner">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-bingo-winner animate-bounce-gentle" />
            <h2 className="text-2xl font-bold mb-2">
              🎉 {winner.username} Wins! 🎉
            </h2>
            <p className="text-muted-foreground">
              Game completed in {formatTime(gameTimer)}
            </p>
            <div className="flex gap-4 justify-center mt-4">
              <Button onClick={onLeaveGame}>Return to Lobby</Button>
              <Button variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Game Area */}
        <div className="xl:col-span-3">
          {!isGameStarted && gameStatus === 'waiting' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Waiting for Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Players ({players.length}/2)</span>
                    <div className="flex items-center gap-2">
                      {players.map((player) => (
                        <Badge 
                          key={player.id} 
                          variant={player.isReady ? "default" : "secondary"}
                        >
                          {player.username} {player.isReady ? "✓" : "..."}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Progress value={(players.filter(p => p.isReady).length / 2) * 100} />
                  
                  {isHost && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={onStartGame}
                        disabled={!canStartGame}
                        className="bg-gradient-to-r from-primary to-accent"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Game
                      </Button>
                      {!canStartGame && (
                        <p className="text-sm text-muted-foreground self-center">
                          Waiting for all players to be ready
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bingo Boards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {players.map((player) => (
              <BingoBoard
                key={player.id}
                playerName={player.username}
                isCurrentPlayer={player.id === currentUser.id}
                calledNumbers={calledNumbers}
                onWin={player.id === currentUser.id ? handleWin : undefined}
                isWinner={player.isWinner}
                disabled={gameStatus !== 'playing'}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Number */}
          {isGameStarted && currentNumber && (
            <Card>
              <CardHeader>
                <CardTitle>Current Number</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {getBingoLetter(currentNumber)}-{currentNumber}
                </div>
                <p className="text-muted-foreground">Just Called</p>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">Next number in:</p>
                  <Progress value={(timeRemaining / 30) * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Status */}
          <Card>
            <CardHeader>
              <CardTitle>Game Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={
                    gameStatus === 'playing' ? 'default' : 
                    gameStatus === 'waiting' ? 'secondary' : 'destructive'
                  }>
                    {gameStatus === 'playing' ? 'In Progress' :
                     gameStatus === 'waiting' ? 'Waiting' : 'Finished'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Players:</span>
                  <span>{players.length}/2</span>
                </div>
                <div className="flex justify-between">
                  <span>Numbers Called:</span>
                  <span>{calledNumbers.length}/75</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Called Numbers History */}
          {calledNumbers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Called Numbers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                  {calledNumbers.slice().reverse().map((number, index) => (
                    <div
                      key={number}
                      className={`
                        text-center p-2 rounded text-sm font-medium
                        ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                      `}
                    >
                      {getBingoLetter(number)}{number}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Players List */}
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <span className={`${player.id === currentUser.id ? 'font-semibold' : ''}`}>
                        {player.username}
                        {player.id === currentUser.id && ' (You)'}
                        {isHost && player.id === players[0]?.id && ' (Host)'}
                      </span>
                    </div>
                    {player.isWinner && <Trophy className="h-4 w-4 text-bingo-winner" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};