import { useState, useCallback } from 'react';
import { PUZZLE_SETS } from '../../lib/crosswordGenerator';
import { Shuffle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function PuzzleSelector({ onSelect, onCustom }) {
  const [refreshing, setRefreshing] = useState(false);
  const [startY, setStartY] = useState(null);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);
  const handleTouchEnd = (e) => {
    if (startY === null) return;
    const diff = e.changedTouches[0].clientY - startY;
    setStartY(null);
    if (diff > 80) {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 800);
    }
  };

  return (
    <div className="flex flex-col h-full" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {refreshing && (
        <div className="flex justify-center py-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <span className="text-3xl">🧩</span>
          </div>
        </div>
        <h1 className="text-xl font-bold text-center text-foreground mb-1">Кроссворд</h1>
        <p className="text-xs text-muted-foreground text-center">Выберите тему или создайте свой</p>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4 space-y-2">
        {PUZZLE_SETS.map((set, idx) => (
          <button
            key={idx}
            className="w-full text-left p-3.5 rounded-xl bg-card border border-border/50 
              hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]
              transition-all duration-150"
            onClick={() => onSelect(set)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{set.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {set.words.length} слов
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Shuffle className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </button>
        ))}

        <Button
          variant="outline"
          className="w-full mt-3 h-12 rounded-xl border-dashed border-2 text-muted-foreground
            hover:text-primary hover:border-primary/50"
          onClick={onCustom}
        >
          <span className="text-lg mr-2">✏️</span>
          Создать свой кроссворд
        </Button>
      </div>
    </div>
  );
}