import type { PokemonData, QuizItem } from '../types/quiz';
import dpData from './pokemon_full_dp.json';
import rsData from './pokemon_full_rs.json';
import gsData from './pokemon_full_gs.json';
import rbData from './pokemon_full_rb.json';

const allData: Record<string, PokemonData[]> = {
  rb: rbData as PokemonData[],
  gs: gsData as PokemonData[],
  rs: rsData as PokemonData[],
  dp: dpData as PokemonData[],
};

// 全データからユニークな技名のリストを作成（ダミー選択肢用）
const getAllMoveNames = (gen: string): string[] => {
  const moveNames = new Set<string>();
  allData[gen].forEach(p => {
    p.moves.forEach(m => moveNames.add(m.move_name));
  });
  return Array.from(moveNames);
};

const getGenLabel = (gen: string): string => {
  switch (gen) {
    case 'rb': return '赤・緑';
    case 'gs': return '金・銀';
    case 'rs': return 'ルビー・サファイア';
    case 'dp': return 'ダイヤモンド・パール';
    default: return '';
  }
};

export const generateQuiz = (gen: string, count: number = 5): QuizItem[] => {
  const sourceWithGen = gen === 'all'
    ? [
      ...allData.rb.map(p => ({ ...p, gen: 'rb' })),
      ...allData.gs.map(p => ({ ...p, gen: 'gs' })),
      ...allData.rs.map(p => ({ ...p, gen: 'rs' })),
      ...allData.dp.map(p => ({ ...p, gen: 'dp' }))
    ]
    : allData[gen].map(p => ({ ...p, gen }));

  const allMoves = gen === 'all'
    ? Array.from(new Set([...getAllMoveNames('rb'), ...getAllMoveNames('gs'), ...getAllMoveNames('rs'), ...getAllMoveNames('dp')]))
    : getAllMoveNames(gen);

  // ランダムにポケモンを選択
  const shuffledSource = [...sourceWithGen].sort(() => Math.random() - 0.5);
  // countが0以下の場合は全件（エンドレス用）
  const targetCount = count > 0 ? count : shuffledSource.length;

  const selectedQuiz: QuizItem[] = [];

  for (const pokemon of shuffledSource) {
    if (selectedQuiz.length >= targetCount) break;
    if (pokemon.moves.length === 0) continue;

    // そのポケモンが覚える技からランダムに1つ選択
    const randomMove = pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)];

    // ダミーの技を作成（そのポケモンが覚えない技からランダムに3つ）
    const pokemonMoveNames = pokemon.moves.map(m => m.move_name);
    const availableDummies = allMoves.filter(name => !pokemonMoveNames.includes(name));
    const shuffledDummies = availableDummies.sort(() => Math.random() - 0.5).slice(0, 3);

    selectedQuiz.push({
      id: pokemon.id,
      pokemon: pokemon.name,
      level: randomMove.level,
      correct: randomMove.move_name,
      dummy: shuffledDummies,
      generation: getGenLabel(pokemon.gen)
    });
  }

  return selectedQuiz;
};
