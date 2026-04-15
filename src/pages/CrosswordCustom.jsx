import { useNavigate } from 'react-router-dom';
import CustomPuzzleForm from '../components/crossword/CustomPuzzleForm';

export default function CrosswordCustom() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-background">
      <CustomPuzzleForm
        onBack={() => navigate('/menu')}
        onGenerate={(puzzleSet) => navigate('/game', { state: { puzzleSet } })}
      />
    </div>
  );
}