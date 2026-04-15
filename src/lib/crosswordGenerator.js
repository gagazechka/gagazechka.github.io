/**
 * Crossword generator algorithm.
 * Takes an array of {clue, answer} and produces a grid with placed words.
 */

const DIRECTIONS = { ACROSS: 'across', DOWN: 'down' };

function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function canPlace(grid, word, row, col, direction) {
  const size = grid.length;
  const len = word.length;

  for (let i = 0; i < len; i++) {
    const r = direction === DIRECTIONS.ACROSS ? row : row + i;
    const c = direction === DIRECTIONS.ACROSS ? col + i : col;

    if (r < 0 || r >= size || c < 0 || c >= size) return false;

    const cell = grid[r][c];
    if (cell !== null && cell !== word[i]) return false;

    // Check adjacent cells (no parallel touching)
    if (cell === null) {
      if (direction === DIRECTIONS.ACROSS) {
        // Check above and below
        if (r > 0 && grid[r - 1][c] !== null && (i === 0 || grid[r - 1][c - 1] === null)) {
          // Only allow if it's an intersection
          const above = grid[r - 1][c];
          if (above !== null) {
            // Check if this is part of a crossing word
            let isCrossing = false;
            if (grid[r][c] === word[i]) isCrossing = true;
            if (!isCrossing) return false;
          }
        }
      }
    }
  }

  // Check before and after the word
  if (direction === DIRECTIONS.ACROSS) {
    if (col > 0 && grid[row][col - 1] !== null) return false;
    if (col + len < size && grid[row][col + len] !== null) return false;
  } else {
    if (row > 0 && grid[row - 1][col] !== null) return false;
    if (row + len < size && grid[row + len][col] !== null) return false;
  }

  return true;
}

function placeWord(grid, word, row, col, direction) {
  const newGrid = grid.map(r => [...r]);
  for (let i = 0; i < word.length; i++) {
    const r = direction === DIRECTIONS.ACROSS ? row : row + i;
    const c = direction === DIRECTIONS.ACROSS ? col + i : col;
    newGrid[r][c] = word[i];
  }
  return newGrid;
}

function findIntersections(grid, word, direction) {
  const size = grid.length;
  const positions = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) continue;

      for (let i = 0; i < word.length; i++) {
        if (word[i] === grid[r][c]) {
          const startRow = direction === DIRECTIONS.ACROSS ? r : r - i;
          const startCol = direction === DIRECTIONS.ACROSS ? c - i : c;

          if (canPlace(grid, word, startRow, startCol, direction)) {
            positions.push({ row: startRow, col: startCol, intersections: 1 });
          }
        }
      }
    }
  }

  return positions;
}

function trimGrid(grid, placements) {
  let minRow = grid.length, maxRow = 0, minCol = grid.length, maxCol = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== null) {
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    }
  }

  const newGrid = [];
  for (let r = minRow; r <= maxRow; r++) {
    newGrid.push(grid[r].slice(minCol, maxCol + 1));
  }

  const adjustedPlacements = placements.map(p => ({
    ...p,
    row: p.row - minRow,
    col: p.col - minCol,
  }));

  return { grid: newGrid, placements: adjustedPlacements };
}

function numberPlacements(placements) {
  // Sort by position (top-to-bottom, left-to-right)
  const sorted = [...placements].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });

  const numberMap = new Map();
  let nextNumber = 1;

  return sorted.map(p => {
    const key = `${p.row},${p.col}`;
    if (!numberMap.has(key)) {
      numberMap.set(key, nextNumber++);
    }
    return { ...p, number: numberMap.get(key) };
  });
}

export function generateCrossword(wordClues) {
  if (!wordClues || wordClues.length === 0) return null;

  // Sort words by length (longest first for better placement)
  const sorted = [...wordClues]
    .map(wc => ({ ...wc, answer: wc.answer.toUpperCase().replace(/[^А-ЯЁA-Z]/g, '') }))
    .sort((a, b) => b.answer.length - a.answer.length);

  const gridSize = 25;
  let grid = createEmptyGrid(gridSize);
  const placements = [];

  // Place first word in the center
  const first = sorted[0];
  const startRow = Math.floor(gridSize / 2);
  const startCol = Math.floor((gridSize - first.answer.length) / 2);
  grid = placeWord(grid, first.answer, startRow, startCol, DIRECTIONS.ACROSS);
  placements.push({
    word: first.answer,
    clue: first.clue,
    row: startRow,
    col: startCol,
    direction: DIRECTIONS.ACROSS,
  });

  // Place remaining words
  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i];
    const word = item.answer;

    // Alternate preferred direction
    const preferredDir = i % 2 === 0 ? DIRECTIONS.ACROSS : DIRECTIONS.DOWN;
    const altDir = preferredDir === DIRECTIONS.ACROSS ? DIRECTIONS.DOWN : DIRECTIONS.ACROSS;

    let placed = false;

    for (const dir of [preferredDir, altDir]) {
      const positions = findIntersections(grid, word, dir);
      if (positions.length > 0) {
        // Pick position with most intersections, or random among best
        positions.sort((a, b) => b.intersections - a.intersections);
        const best = positions[0];
        grid = placeWord(grid, word, best.row, best.col, dir);
        placements.push({
          word,
          clue: item.clue,
          row: best.row,
          col: best.col,
          direction: dir,
        });
        placed = true;
        break;
      }
    }

    // If can't intersect, try placing near existing words
    if (!placed) {
      for (const dir of [preferredDir, altDir]) {
        let bestPos = null;
        let bestDist = Infinity;

        for (let r = 0; r < gridSize; r++) {
          for (let c = 0; c < gridSize; c++) {
            if (canPlace(grid, word, r, c, dir)) {
              // Calculate distance to center of existing placements
              const centerR = placements.reduce((s, p) => s + p.row, 0) / placements.length;
              const centerC = placements.reduce((s, p) => s + p.col, 0) / placements.length;
              const dist = Math.abs(r - centerR) + Math.abs(c - centerC);
              if (dist < bestDist) {
                bestDist = dist;
                bestPos = { row: r, col: c };
              }
            }
          }
        }

        if (bestPos) {
          grid = placeWord(grid, word, bestPos.row, bestPos.col, dir);
          placements.push({
            word,
            clue: item.clue,
            row: bestPos.row,
            col: bestPos.col,
            direction: dir,
          });
          placed = true;
          break;
        }
      }
    }
  }

  const trimmed = trimGrid(grid, placements);
  const numbered = numberPlacements(trimmed.placements);

  return {
    grid: trimmed.grid,
    placements: numbered,
    rows: trimmed.grid.length,
    cols: trimmed.grid[0]?.length || 0,
  };
}

// Default puzzle sets
export const PUZZLE_SETS = [
  {
    name: "🌍 География",
    words: [
      { clue: "Самый большой океан", answer: "ТИХИЙ" },
      { clue: "Столица Франции", answer: "ПАРИЖ" },
      { clue: "Самая длинная река в мире", answer: "НИЛ" },
      { clue: "Горная система в Азии", answer: "ГИМАЛАИ" },
      { clue: "Самый маленький континент", answer: "АВСТРАЛИЯ" },
      { clue: "Озеро в Сибири, самое глубокое", answer: "БАЙКАЛ" },
      { clue: "Страна восходящего солнца", answer: "ЯПОНИЯ" },
      { clue: "Полуостров на юге Европы", answer: "ИТАЛИЯ" },
    ]
  },
  {
    name: "🔬 Наука",
    words: [
      { clue: "Единица измерения силы тока", answer: "АМПЕР" },
      { clue: "Химический элемент, символ O", answer: "КИСЛОРОД" },
      { clue: "Планета с кольцами", answer: "САТУРН" },
      { clue: "Наука о живых организмах", answer: "БИОЛОГИЯ" },
      { clue: "Элементарная частица с отрицательным зарядом", answer: "ЭЛЕКТРОН" },
      { clue: "Единица измерения энергии", answer: "ДЖОУЛЬ" },
      { clue: "Скорость света в вакууме (единица)", answer: "МЕТР" },
      { clue: "Наука о звёздах", answer: "АСТРОНОМИЯ" },
    ]
  },
  {
    name: "📚 Литература",
    words: [
      { clue: "Автор 'Войны и мира'", answer: "ТОЛСТОЙ" },
      { clue: "Герой романа Достоевского о преступлении", answer: "РАСКОЛЬНИКОВ" },
      { clue: "Поэма Гоголя о мёртвых", answer: "ДУШИ" },
      { clue: "Автор 'Евгения Онегина'", answer: "ПУШКИН" },
      { clue: "Жанр сказки в стихах", answer: "ПОЭМА" },
      { clue: "Русский баснописец", answer: "КРЫЛОВ" },
      { clue: "Автор 'Мастера и Маргариты'", answer: "БУЛГАКОВ" },
    ]
  },
  {
    name: "💻 Технологии",
    words: [
      { clue: "Язык разметки для веб-страниц", answer: "HTML" },
      { clue: "Устройство для ввода текста", answer: "КЛАВИАТУРА" },
      { clue: "Всемирная сеть", answer: "ИНТЕРНЕТ" },
      { clue: "Мозг компьютера", answer: "ПРОЦЕССОР" },
      { clue: "Хранилище данных в облаке", answer: "СЕРВЕР" },
      { clue: "Программа для просмотра сайтов", answer: "БРАУЗЕР" },
      { clue: "Беспроводная сеть", answer: "ВАЙФАЙ" },
      { clue: "Искусственный интеллект (аббр.)", answer: "ИИ" },
    ]
  }
];