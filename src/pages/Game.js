import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
  const [participants, setParticipants] = useState([]);
  const [spiciness, setSpiciness] = useState(1);
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);

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

  // Muda pimentas (spiciness) e já pega nova pergunta
  const handleClickPepper = (level) => {
    setSpiciness((old) => {
      pickNewQuestionAndParticipant(participants, level);
      return level;
    });
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
              style={{ width: '40px', cursor: 'pointer', marginRight: '5px' }}
              onClick={() => handleClickPepper(level)}
            />
          );
        })}
      </div>

      <h3 className="participante-sorteado">{currentParticipant}</h3>
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
    </div>
  );
}

export default Game;
