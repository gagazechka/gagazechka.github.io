import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useState } from 'react';

export default function CluesPanel({
  placements,
  selectedWord,
  onClueClick,
  solvedWords,
}) {
  const [expanded, setExpanded] = useState(true);

  const acrossClues = placements
    .filter(p => p.direction === 'across')
    .sort((a, b) => a.number - b.number);

  const downClues = placements
    .filter(p => p.direction === 'down')
    .sort((a, b) => a.number - b.number);

  return (
    <div className="px-4 pb-4">
      <button
        className="w-full flex items-center justify-between py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        onClick={() => setExpanded(!expanded)}
      >
        <span>Подсказки</span>
        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {expanded && (
        <div className="space-y-3 animate-slide-up">
          {acrossClues.length > 0 && (
            <ClueSection
              title="По горизонтали →"
              clues={acrossClues}
              selectedWord={selectedWord}
              onClueClick={onClueClick}
              solvedWords={solvedWords}
            />
          )}
          {downClues.length > 0 && (
            <ClueSection
              title="По вертикали ↓"
              clues={downClues}
              selectedWord={selectedWord}
              onClueClick={onClueClick}
              solvedWords={solvedWords}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ClueSection({ title, clues, selectedWord, onClueClick, solvedWords }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-1.5">{title}</p>
      <div className="space-y-0.5">
        {clues.map(clue => {
          const isSelected = selectedWord?.number === clue.number && selectedWord?.direction === clue.direction;
          const isSolved = solvedWords.has(clue.number);

          return (
            <button
              key={`${clue.direction}-${clue.number}`}
              className={`
                w-full text-left px-2.5 py-1.5 rounded-lg flex items-start gap-2 transition-all duration-150
                ${isSelected
                  ? 'bg-primary/20 ring-1 ring-primary/30'
                  : isSolved
                    ? 'bg-success/10'
                    : 'hover:bg-secondary/80'
                }
              `}
              onClick={() => onClueClick(clue)}
            >
              <span className={`
                text-[10px] font-bold mt-0.5 shrink-0 w-4 text-center
                ${isSolved ? 'text-success' : isSelected ? 'text-primary' : 'text-muted-foreground'}
              `}>
                {clue.number}
              </span>
              <span className={`
                text-xs leading-snug flex-1
                ${isSolved ? 'text-success/70 line-through' : 'text-foreground/80'}
              `}>
                {clue.clue}
              </span>
              {isSolved && (
                <Check className="h-3 w-3 text-success mt-0.5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}