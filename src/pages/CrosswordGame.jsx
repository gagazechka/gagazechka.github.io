import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateCrossword } from '../lib/crosswordGenerator';
import GameHeader from '../components/crossword/GameHeader';
import CrosswordGrid from '../components/crossword/CrosswordGrid';

export default function CrosswordGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const puzzleSet = location.state?.puzzleSet;

  const [puzzle] = useState(() => puzzleSet ? generateCrossword(puzzleSet.words) : null);
  const [userInput, setUserInput] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState('across');
  const [solvedWords, setSolvedWords] = useState(new Set());

  // Redirect if no puzzle data
  useEffect(() => {
    if (!puzzleSet) navigate('/menu', { replace: true });
  }, [puzzleSet, navigate]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const checkSolved = useCallback((updated, placements) => {
    const newSolved = new Set();
    placements.forEach(p => {
      let ok = true;
      for (let i = 0; i < p.word.length; i++) {
        const pr = p.direction === 'across' ? p.row : p.row + i;
        const pc = p.direction === 'across' ? p.col + i : p.col;
        if (updated[`${pr},${pc}`] !== p.word[i]) { ok = false; break; }
      }
      if (ok) newSolved.add(p.number);
    });
    return newSolved;
  }, []);

  const handleCellChange = useCallback((r, c, value) => {
    setUserInput(prev => {
      const updated = { ...prev, [`${r},${c}`]: value };
      if (puzzle) setSolvedWords(checkSolved(updated, puzzle.placements));
      return updated;
    });
  }, [puzzle, checkSolved]);

  const handleCellSelect = useCallback((cell, direction) => {
    setSelectedCell(cell);
    setSelectedDirection(direction);
  }, []);

  const handleReset = useCallback(() => {
    setUserInput({});
    setSolvedWords(new Set());
    setSelectedCell(null);
  }, []);

  const selectedWord = useMemo(() => {
    if (!selectedCell || !puzzle) return null;
    return puzzle.placements.find(p => {
      if (p.direction !== selectedDirection) return false;
      for (let i = 0; i < p.word.length; i++) {
        const r = p.direction === 'across' ? p.row : p.row + i;
        const c = p.direction === 'across' ? p.col + i : p.col;
        if (r === selectedCell.row && c === selectedCell.col) return true;
      }
      return false;
    }) || null;
  }, [selectedCell, selectedDirection, puzzle]);

  const handleHint = useCallback(() => {
    if (!selectedWord) return;
    setUserInput(prev => {
      for (let i = 0; i < selectedWord.word.length; i++) {
        const r = selectedWord.direction === 'across' ? selectedWord.row : selectedWord.row + i;
        const c = selectedWord.direction === 'across' ? selectedWord.col + i : selectedWord.col;
        const key = `${r},${c}`;
        if (prev[key] !== selectedWord.word[i]) {
          const updated = { ...prev, [key]: selectedWord.word[i] };
          if (puzzle) setSolvedWords(checkSolved(updated, puzzle.placements));
          return updated;
        }
      }
      return prev;
    });
  }, [selectedWord, puzzle, checkSolved]);

  if (!puzzle) return null;

  return (
    <div className="h-full bg-background flex flex-col">
      <GameHeader
        solvedCount={solvedWords.size}
        totalCount={puzzle.placements.length}
        onNewGame={() => navigate('/menu')}
        onReset={handleReset}
        onHint={handleHint}
        hasSelectedWord={!!selectedWord}
        showBack
        onBack={() => navigate('/menu')}
      />

      <div className="flex-1 overflow-auto">
        <div className="py-2">
          {selectedWord && (
            <div className="mx-4 mb-2 px-3 py-2 rounded-xl bg-primary/20 border border-primary/30 flex items-start gap-2 animate-slide-up">
              <span className="text-[10px] font-bold text-primary shrink-0 mt-0.5">
                {selectedWord.number}{selectedWord.direction === 'across' ? '→' : '↓'}
              </span>
              <p className="text-xs text-foreground leading-snug">{selectedWord.clue}</p>
            </div>
          )}

          <CrosswordGrid
            grid={puzzle.grid}
            placements={puzzle.placements}
            userInput={userInput}
            onCellChange={handleCellChange}
            selectedCell={selectedCell}
            onCellSelect={handleCellSelect}
            selectedDirection={selectedDirection}
            solvedWords={solvedWords}
          />
        </div>
      </div>
    </div>
  );
}