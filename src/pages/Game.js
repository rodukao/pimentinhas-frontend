import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WarningModal from '../components/warningModal';

function Game() {
  const [participants, setParticipants] = useState([]);
  const [spiciness, setSpiciness] = useState(1);
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);
  const [showWarning, setShowWarning] = useState(false); 

  useEffect(() => {
    const storedParticipants = localStorage.getItem('participants');
    const storedSpiciness = localStorage.getItem('spiciness');

    let parsedParticipants = [];
    let parsedSpiciness = 1;

    if (storedParticipants) {
      parsedParticipants = JSON.parse(storedParticipants);
    }
    if (storedSpiciness) {
      parsedSpiciness = parseInt(storedSpiciness, 10);
    }

    setParticipants(parsedParticipants);
    setSpiciness(parsedSpiciness);

    // Chama a função para buscar a pergunta ao montar
    pickNewQuestionAndParticipant(parsedParticipants, parsedSpiciness);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função que sorteia participante e busca pergunta no back
  const pickNewQuestionAndParticipant = async (
    pArray = participants,
    spice = spiciness
  ) => {
    if (!pArray.length) return;

    // Habilita o "carregando"
    setIsFetchingQuestion(true);

    // Sorteia participante
    const randomIndex = Math.floor(Math.random() * pArray.length);
    const chosenParticipant = pArray[randomIndex];
    setCurrentParticipant(chosenParticipant);

    try {
      const response = await axios.get(
        `https://django-perguntas-pimentinhas.onrender.com/api/perguntas?level=${spice}`
      );
      setCurrentQuestion(response.data.question);
    } catch (error) {
      console.error(error);
      setCurrentQuestion('Não foi possível buscar pergunta agora.');
    } finally {
      // Desabilita o "carregando"
      setIsFetchingQuestion(false);
    }
  };

  const fetchQuestionForCurrentParticipant = async (newSpiceLevel) => {
      if (!currentParticipant || isFetchingQuestion) return;

      setIsFetchingQuestion(true);
      setSpiciness(newSpiceLevel);
      localStorage.setItem('spiciness', newSpiceLevel);

      try{
        const response = await axios.get(
          `https://django-perguntas-pimentinhas.onrender.com/api/perguntas?level=${newSpiceLevel}`
        );
        setCurrentQuestion(response.data.question);
      } catch (error){
        console.error('Erro ao buscar nova pergunta para o mesmo participante:', error);
        setCurrentQuestion('Não foi possível buscar pergunta agora.');
      } finally {
        setIsFetchingQuestion(false);
      }
  };

  // Muda pimentas (spiciness) e já pega nova pergunta
  const handleClickPepper = (level) => {
    if(level === spiciness || isFetchingQuestion){
      return;
    }

    if (level === 5){
      setShowWarning(true);
    } else {
      fetchQuestionForCurrentParticipant(level);
    }
  };

  // 4. Funções Handler para o Modal
  const handleConfirmWarning = () => {
    setShowWarning(false); // Fecha o modal
    // Continua para buscar a pergunta do nível 5 para o participante atual
    fetchQuestionForCurrentParticipant(5);
  };
  
  const handleCloseWarning = () => {
    setShowWarning(false); // Apenas fecha o modal
    // Não muda o nível nem busca pergunta
  };

  const nextQuestion = () => {
    pickNewQuestionAndParticipant();
  };

  const goBack = () => {
    window.location.href = '/setup';
  };

  // Se ainda não carregou nada, exibimos "Carregando..." em vez da pergunta
  const questionToShow = isFetchingQuestion
    ? 'Carregando...'
    : currentQuestion;

  return (
    <div className="main">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((level) => {
          const pepperImg =
            level <= spiciness
              ? '/images/pimenta_vermelha.png'
              : '/images/pimenta_cinza.png';

          return (
            <img
              key={level}
              src={pepperImg}
              alt={level <= spiciness ? 'Pimenta Vermelha' : 'Pimenta Cinza'}
              style={{
                  width: '40px',
                  cursor: isFetchingQuestion || level === spiciness ? 'default' : 'pointer', // Muda cursor se desabilitado
                  marginRight: '5px',
                  opacity: isFetchingQuestion || level === spiciness ? 0.6 : 1 // Atenua se desabilitado
              }}
              onClick={() => handleClickPepper(level)} // Chama a função modificada
            />
          );
        })}
      </div>

      <h3 className="participante-sorteado">{currentParticipant || 'Sorteando...'}</h3>
      <p className="pergunta-sorteada">{questionToShow}</p>

      <button
        className="botao"
        onClick={nextQuestion}
        disabled={isFetchingQuestion} // Desabilita se estiver carregando
      >
        {isFetchingQuestion ? 'Carregando...' : 'Próxima Pergunta'}
      </button>

      <button className="botao-voltar" onClick={goBack}>
        Voltar
      </button>

      <WarningModal
        show={showWarning}
        onClose={handleCloseWarning}
        onConfirm={handleConfirmWarning}
      />
    </div>
  );
}

export default Game;
