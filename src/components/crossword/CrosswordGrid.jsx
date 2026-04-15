import { useRef, useEffect, useCallback } from 'react';

export default function CrosswordGrid({
  grid,
  placements,
  userInput,
  onCellChange,
  selectedCell,
  onCellSelect,
  selectedDirection,
  solvedWords,
}) {
  const inputRefs = useRef({});
  const gridRef = useRef(null);

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // Build a map of cell -> number
  const numberMap = {};
  placements.forEach(p => {
    const key = `${p.row},${p.col}`;
    if (!numberMap[key]) numberMap[key] = p.number;
  });

  // Build a map of cell -> which words it belongs to
  const cellWordMap = {};
  placements.forEach(p => {
    for (let i = 0; i < p.word.length; i++) {
      const r = p.direction === 'across' ? p.row : p.row + i;
      const c = p.direction === 'across' ? p.col + i : p.col;
      const key = `${r},${c}`;
      if (!cellWordMap[key]) cellWordMap[key] = [];
      cellWordMap[key].push({ placement: p, index: i });
    }
  });

  // Find which word is selected
  const getSelectedWord = useCallback(() => {
    if (!selectedCell) return null;
    const key = `${selectedCell.row},${selectedCell.col}`;
    const words = cellWordMap[key];
    if (!words) return null;
    const match = words.find(w => w.placement.direction === selectedDirection);
    return match?.placement || words[0]?.placement;
  }, [selectedCell, selectedDirection, cellWordMap]);

  const selectedWord = getSelectedWord();

  // Check if cell is part of selected word
  const isCellInSelectedWord = (r, c) => {
    if (!selectedWord) return false;
    for (let i = 0; i < selectedWord.word.length; i++) {
      const wr = selectedWord.direction === 'across' ? selectedWord.row : selectedWord.row + i;
      const wc = selectedWord.direction === 'across' ? selectedWord.col + i : selectedWord.col;
      if (wr === r && wc === c) return true;
    }
    return false;
  };

  // Check if cell belongs to a solved word
  const isCellSolved = (r, c) => {
    const key = `${r},${c}`;
    const words = cellWordMap[key];
    if (!words) return false;
    return words.some(w => solvedWords.has(w.placement.number));
  };

  const handleCellClick = (r, c) => {
    if (grid[r][c] === null) return;

    const key = `${r},${c}`;
    const words = cellWordMap[key];
    if (!words) return;

    if (selectedCell?.row === r && selectedCell?.col === c) {
      // Toggle direction
      const dirs = words.map(w => w.placement.direction);
      const newDir = selectedDirection === 'across' ? 'down' : 'across';
      const finalDir = dirs.includes(newDir) ? newDir : dirs[0];
      onCellSelect({ row: r, col: c }, finalDir);
    } else {
      // Select this cell
      const preferredWord = words.find(w => w.placement.direction === selectedDirection);
      const dir = preferredWord ? selectedDirection : words[0].placement.direction;
      onCellSelect({ row: r, col: c }, dir);
    }

    // Focus the hidden input
    const inputKey = `${r}-${c}`;
    if (inputRefs.current[inputKey]) {
      inputRefs.current[inputKey].focus();
    }
  };

  const handleKeyInput = (r, c, value) => {
    const letter = value.toUpperCase().replace(/[^А-ЯЁA-Z]/g, '');
    if (!letter) return;

    onCellChange(r, c, letter.charAt(letter.length - 1));

    // Move to next cell in direction
    moveToNext(r, c);
  };

  const handleKeyDown = (r, c, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const currentVal = userInput[`${r},${c}`];
      if (currentVal) {
        onCellChange(r, c, '');
      } else {
        moveToPrev(r, c);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (c + 1 < cols && grid[r][c + 1] !== null) {
        onCellSelect({ row: r, col: c + 1 }, 'across');
        focusCell(r, c + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (c - 1 >= 0 && grid[r][c - 1] !== null) {
        onCellSelect({ row: r, col: c - 1 }, 'across');
        focusCell(r, c - 1);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (r + 1 < rows && grid[r + 1][c] !== null) {
        onCellSelect({ row: r + 1, col: c }, 'down');
        focusCell(r + 1, c);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (r - 1 >= 0 && grid[r - 1][c] !== null) {
        onCellSelect({ row: r - 1, col: c }, 'down');
        focusCell(r - 1, c);
      }
    }
  };

  const moveToNext = (r, c) => {
    const nr = selectedDirection === 'down' ? r + 1 : r;
    const nc = selectedDirection === 'across' ? c + 1 : c;
    if (nr < rows && nc < cols && grid[nr]?.[nc] !== null) {
      onCellSelect({ row: nr, col: nc }, selectedDirection);
      focusCell(nr, nc);
    }
  };

  const moveToPrev = (r, c) => {
    const nr = selectedDirection === 'down' ? r - 1 : r;
    const nc = selectedDirection === 'across' ? c - 1 : c;
    if (nr >= 0 && nc >= 0 && grid[nr]?.[nc] !== null) {
      onCellChange(nr, nc, '');
      onCellSelect({ row: nr, col: nc }, selectedDirection);
      focusCell(nr, nc);
    }
  };

  const focusCell = (r, c) => {
    setTimeout(() => {
      const key = `${r}-${c}`;
      if (inputRefs.current[key]) {
        inputRefs.current[key].focus();
      }
    }, 10);
  };

  // Calculate cell size based on grid dimensions
  const maxCellSize = 42;
  const minCellSize = 28;
  const gap = 2;

  const cellSize = Math.max(minCellSize, Math.min(maxCellSize, Math.floor((window.innerWidth - 32 - gap * (cols - 1)) / cols)));

  return (
    <div className="flex justify-center px-2 overflow-auto" ref={gridRef}>
      <div
        className="inline-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            if (cell === null) {
              return (
                <div
                  key={`${r}-${c}`}
                  className="rounded-[3px]"
                  style={{ width: cellSize, height: cellSize }}
                />
              );
            }

            const isSelected = selectedCell?.row === r && selectedCell?.col === c;
            const isHighlighted = isCellInSelectedWord(r, c);
            const solved = isCellSolved(r, c);
            const number = numberMap[`${r},${c}`];
            const userLetter = userInput[`${r},${c}`] || '';
            const isCorrect = userLetter === cell;

            return (
              <div
                key={`${r}-${c}`}
                className={`
                  relative rounded-[4px] flex items-center justify-center cursor-pointer
                  transition-all duration-150
                  ${isSelected
                    ? 'bg-primary/30 ring-2 ring-primary shadow-lg shadow-primary/20'
                    : isHighlighted
                      ? 'bg-primary/15 ring-1 ring-primary/30'
                      : solved
                        ? 'bg-success/15 ring-1 ring-success/20'
                        : 'bg-secondary ring-1 ring-border/50'
                  }
                  ${isSelected ? 'animate-cell-pop' : ''}
                `}
                style={{ width: cellSize, height: cellSize }}
                onClick={() => handleCellClick(r, c)}
              >
                {number && (
                  <span
                    className="absolute font-bold text-primary/70"
                    style={{
                      top: 1,
                      left: 2,
                      fontSize: cellSize < 34 ? '7px' : '8px',
                      lineHeight: 1,
                    }}
                  >
                    {number}
                  </span>
                )}
                <span
                  className={`font-bold leading-none ${
                    solved ? 'text-success' : userLetter ? 'text-foreground' : 'text-transparent'
                  }`}
                  style={{ fontSize: cellSize < 34 ? '14px' : '17px' }}
                >
                  {userLetter || '·'}
                </span>

                {/* Hidden input for mobile keyboard */}
                <input
                  ref={el => { inputRefs.current[`${r}-${c}`] = el; }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  style={{ fontSize: '16px' }} // Prevents zoom on iOS
                  value=""
                  onChange={e => handleKeyInput(r, c, e.target.value)}
                  onKeyDown={e => handleKeyDown(r, c, e)}
                  inputMode="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  spellCheck="false"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}