import { Trophy, RotateCcw, Sparkles, Lightbulb, ArrowLeft } from 'lucide-react';
import { Button } from "../ui/button";

export default function GameHeader({ solvedCount, totalCount, onNewGame, onReset, onHint, hasSelectedWord, showBack, onBack }) {
  const progress = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;
  const isComplete = solvedCount === totalCount && totalCount > 0;

  return (
    <div className="px-4 pt-3 pb-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-lg">🧩</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-tight">Кроссворд</h1>
            <p className="text-[10px] text-muted-foreground">
              {isComplete ? "Поздравляем! 🎉" : `${solvedCount} из ${totalCount} слов`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-lg transition-colors ${
              hasSelectedWord ? 'text-warning hover:text-warning/80' : 'text-muted-foreground opacity-40'
            }`}
            onClick={onHint}
            disabled={!hasSelectedWord}
            title="Открыть букву"
          >
            <Lightbulb className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={onNewGame}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: isComplete
              ? 'hsl(var(--success))'
              : 'hsl(var(--primary))',
          }}
        />
      </div>

      {isComplete && (
        <div className="mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-success/10">
          <Trophy className="h-3.5 w-3.5 text-success" />
          <span className="text-xs font-semibold text-success">Все слова разгаданы!</span>
        </div>
      )}
    </div>
  );
}