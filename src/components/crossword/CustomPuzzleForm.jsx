import { useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from "../ui/button";

const PLACEHOLDER = `ПАРИЖ - Столица Франции
БАЙКАЛ - Самое глубокое озеро
НИЛ - Самая длинная река в мире
МОСКВА - Столица России`;

export default function CustomPuzzleForm({ onBack, onGenerate }) {
  const [text, setText] = useState('');

  const parseWords = () => {
    return text
      .split('\n')
      .map(line => {
        const dashIdx = line.indexOf('-');
        if (dashIdx === -1) return null;
        const answer = line.slice(0, dashIdx).trim();
        const clue = line.slice(dashIdx + 1).trim();
        if (!answer || !clue) return null;
        return { answer, clue };
      })
      .filter(Boolean);
  };

  const words = parseWords();
  const canGenerate = words.length >= 2;

  const handleGenerate = () => {
    onGenerate({ name: "✏️ Мой кроссворд", words });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-sm font-bold text-foreground">Создать кроссворд</h2>
          <p className="text-[10px] text-muted-foreground">Формат: ОТВЕТ - Подсказка (каждое слово с новой строки)</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4 flex flex-col gap-3">
        <textarea
          className="flex-1 min-h-[200px] w-full rounded-xl bg-card border border-border/50 p-3 
            text-sm text-foreground placeholder:text-muted-foreground/50
            focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          placeholder={PLACEHOLDER}
          value={text}
          onChange={e => setText(e.target.value)}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="characters"
        />

        {text.trim() && (
          <div className="rounded-xl bg-secondary/50 border border-border/30 p-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Распознано слов: {words.length}
            </p>
            <div className="space-y-1">
              {words.map((w, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-primary w-4 text-center">{i + 1}</span>
                  <span className="font-semibold text-foreground">{w.answer}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-foreground/70">{w.clue}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-2">
        <Button
          className="w-full h-12 rounded-xl text-sm font-semibold"
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          <Play className="h-4 w-4 mr-2" />
          Сгенерировать кроссворд ({words.length} слов)
        </Button>
      </div>
    </div>
  );
}