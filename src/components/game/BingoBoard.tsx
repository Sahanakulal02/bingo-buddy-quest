import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Crown, Trophy } from "lucide-react";

interface BingoCell {
  number: number;
  called: boolean;
  selected: boolean;
  isFree?: boolean;
}

interface BingoBoardProps {
  playerName: string;
  isCurrentPlayer?: boolean;
  onCellSelect?: (row: number, col: number) => void;
  calledNumbers: number[];
  onWin?: () => void;
  isWinner?: boolean;
  disabled?: boolean;
}

export const BingoBoard = ({ 
  playerName, 
  isCurrentPlayer = false, 
  onCellSelect, 
  calledNumbers = [],
  onWin,
  isWinner = false,
  disabled = false
}: BingoBoardProps) => {
  const [board, setBoard] = useState<BingoCell[][]>(() => {
    // Generate a random bingo board
    const generateBoard = () => {
      const board: BingoCell[][] = [];
      const letters = ['B', 'I', 'N', 'G', 'O'];
      
      for (let row = 0; row < 5; row++) {
        board[row] = [];
        for (let col = 0; col < 5; col++) {
          // Free space in the center
          if (row === 2 && col === 2) {
            board[row][col] = {
              number: 0,
              called: true,
              selected: true,
              isFree: true
            };
            continue;
          }
          
          // Generate random number based on column (B: 1-15, I: 16-30, etc.)
          const min = col * 15 + 1;
          const max = (col + 1) * 15;
          const number = Math.floor(Math.random() * (max - min + 1)) + min;
          
          board[row][col] = {
            number,
            called: false,
            selected: false
          };
        }
      }
      return board;
    };
    
    return generateBoard();
  });

  const checkForWin = (updatedBoard: BingoCell[][]) => {
    // Check rows
    for (let row = 0; row < 5; row++) {
      if (updatedBoard[row].every(cell => cell.selected)) {
        return true;
      }
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
      if (updatedBoard.every(row => row[col].selected)) {
        return true;
      }
    }
    
    // Check diagonals
    if (updatedBoard.every((row, i) => row[i].selected) ||
        updatedBoard.every((row, i) => row[4 - i].selected)) {
      return true;
    }
    
    return false;
  };

  const handleCellClick = (row: number, col: number) => {
    if (disabled || !isCurrentPlayer || board[row][col].isFree) return;
    
    const cell = board[row][col];
    if (!cell.called) return; // Can only select called numbers
    
    const updatedBoard = board.map((r, rowIndex) =>
      r.map((c, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...c, selected: !c.selected };
        }
        return c;
      })
    );
    
    setBoard(updatedBoard);
    
    // Check for win
    if (checkForWin(updatedBoard) && onWin) {
      onWin();
    }
    
    onCellSelect?.(row, col);
  };

  // Update called numbers
  const updatedBoard = board.map(row =>
    row.map(cell => ({
      ...cell,
      called: cell.isFree || calledNumbers.includes(cell.number)
    }))
  );

  const letters = ['B', 'I', 'N', 'G', 'O'];

  return (
    <Card className={`p-4 transition-all duration-300 ${isWinner ? 'animate-celebrate bg-gradient-to-br from-bingo-winner/20 to-accent/20' : ''} ${isCurrentPlayer ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{playerName}</h3>
          {isCurrentPlayer && (
            <Badge variant="default" className="animate-pulse-glow">
              You
            </Badge>
          )}
          {isWinner && (
            <div className="flex items-center gap-1">
              <Crown className="h-5 w-5 text-bingo-winner" />
              <Badge variant="default" className="bg-bingo-winner text-black">
                Winner!
              </Badge>
            </div>
          )}
        </div>
        {isWinner && (
          <Trophy className="h-6 w-6 text-bingo-winner animate-bounce-gentle" />
        )}
      </div>
      
      <div className="bg-bingo-board rounded-lg p-3">
        {/* Column headers */}
        <div className="grid grid-cols-5 gap-1 mb-2">
          {letters.map((letter, index) => (
            <div 
              key={letter} 
              className="h-8 flex items-center justify-center font-bold text-primary text-lg"
            >
              {letter}
            </div>
          ))}
        </div>
        
        {/* Bingo grid */}
        <div className="grid grid-cols-5 gap-1">
          {updatedBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  h-12 w-12 p-0 text-sm font-bold transition-all duration-200
                  ${cell.isFree 
                    ? 'bg-primary text-primary-foreground' 
                    : cell.selected 
                    ? 'bg-bingo-selected text-white' 
                    : cell.called 
                    ? 'bg-bingo-called text-white hover:bg-bingo-called/80' 
                    : 'bg-bingo-cell text-foreground hover:bg-bingo-cell-hover'
                  }
                  ${cell.called && !cell.selected && isCurrentPlayer ? 'animate-pulse-glow' : ''}
                  ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                `}
                disabled={disabled}
                variant="ghost"
              >
                {cell.isFree ? 'FREE' : cell.number}
              </Button>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};