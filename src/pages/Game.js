import React, { useState, useEffect } from 'react';

function Game() {
  const [participants, setParticipants] = useState([]);
  const [spiciness, setSpiciness] = useState(1);
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');

  // Perguntas de teste
  const QUESTIONS = {
    1: [
      "Qual foi a última mentira que você contou?",
      "De qual hábito ruim você gostaria de se livrar?",
      "Qual foi o momento mais embaraçoso que você já viveu?"
    ],
    2: [
      "Você já fingiu estar doente para não ir ao trabalho ou à escola?",
      "Qual foi a última coisa estranha que pesquisou no Google?",
      "Você já deixou de pagar alguma conta por puro esquecimento?"
    ],
    3: [
      "Já se arrependeu de algo que disse no calor de uma discussão?",
      "Qual foi a desculpa mais esfarrapada que você deu para evitar alguém?",
      "Você já 'stalkeou' alguém nas redes sociais e se arrependeu?"
    ],
    4: [
      "Você já foi pego(a) mentindo sobre algo realmente sério?",
      "Qual a coisa mais arriscada ou ilegal que você já fez?",
      "Qual o segredo mais estranho que você já guardou de alguém?"
    ],
    5: [
      "Qual foi a situação mais picante que você já passou em público?",
      "Você já se envolveu em algo íntimo que hoje acha constrangedor?",
      "Qual o maior fetiche ou tabu que você tem e não costuma revelar?"
    ],
  };

  useEffect(() => {
    // Lê do localStorage
    const storedParticipants = localStorage.getItem('participants');
    const storedSpiciness = localStorage.getItem('spiciness');
    
    // Transforma em valores (ou arrays) concretos
    let parsedParticipants = [];
    let parsedSpiciness = 1;
    
    if (storedParticipants) {
      parsedParticipants = JSON.parse(storedParticipants);
    }
    if (storedSpiciness) {
      parsedSpiciness = parseInt(storedSpiciness);
    }

    // Atualiza estado
    setParticipants(parsedParticipants);
    setSpiciness(parsedSpiciness);

    // Já sorteia alguém e uma pergunta
    pickNewQuestionAndParticipant(parsedParticipants, parsedSpiciness);
    // eslint-disable-next-line
  }, []);

  const handleClickPepper = (level) => {
    setSpiciness(() => {
      // Se quiser que mude a pergunta automaticamente ao trocar spiciness,
      // chamamos a função de sorteio aqui também:
      pickNewQuestionAndParticipant(participants, level);
      return level;
    });
  };

  // Modifiquei essa função pra receber participants/spice como parâmetros
  // assim a gente consegue usar eles antes do state estar atualizado
  const pickNewQuestionAndParticipant = (pArray = participants, spice = spiciness) => {
    if (!pArray.length) return;  // Se não tiver ninguém, não faz nada

    // Sorteia participante
    const randomIndex = Math.floor(Math.random() * pArray.length);
    const chosenParticipant = pArray[randomIndex];

    // Sorteia pergunta
    const possibleQuestions = QUESTIONS[spice] || [];
    if (!possibleQuestions.length) return;
    const randomQuestionIndex = Math.floor(Math.random() * possibleQuestions.length);
    const chosenQuestion = possibleQuestions[randomQuestionIndex];

    setCurrentParticipant(chosenParticipant);
    setCurrentQuestion(chosenQuestion);
  };

  // Chamado quando clica no "Próxima Pergunta"
  const nextQuestion = () => {
    pickNewQuestionAndParticipant();
  };

  const goBack = () => {
    window.location.href = '/setup';
  };

  return (
    <div className='main'>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((level) => {
          // Decide se mostra pimenta vermelha ou cinza
          const pepperImg = level <= spiciness
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

      <h3 className='participante-sorteado'>{currentParticipant}</h3>
      <p className='pergunta-sorteada'>{currentQuestion}</p>

      <button className='botao' onClick={nextQuestion}>Próxima Pergunta</button>
      <button className='botao-voltar' onClick={goBack}>Voltar</button>
    </div>
  );
}

export default Game;
