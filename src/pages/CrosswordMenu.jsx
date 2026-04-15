import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PuzzleSelector from '../components/crossword/PuzzleSelector';

export default function CrosswordMenu() {
  const navigate = useNavigate();

  const handleSelect = useCallback((puzzleSet) => {
    navigate('/game', { state: { puzzleSet } });
  }, [navigate]);

  const handleCustom = useCallback(() => {
    navigate('/custom');
  }, [navigate]);

  return (
    <div className="h-full bg-background overflow-auto">
      <PuzzleSelector onSelect={handleSelect} onCustom={handleCustom} />
    </div>
  );
}