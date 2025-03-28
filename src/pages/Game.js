import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Ajuste o caminho se o seu componente WarningModal estiver em outro lugar
import WarningModal from '../components/warningModal';

// Defina a URL base da sua API aqui para facilitar a manutenção
//const API_BASE_URL = 'http://127.0.0.1:8000';
const API_BASE_URL = 'https://django-perguntas-pimentinhas.onrender.com';
// Se o frontend e o backend estiverem no mesmo domínio, você pode usar URLs relativas:
// const API_BASE_URL = ''; // Ex: '/api/perguntas', '/api/stats'

function Game() {
  // Estados existentes
  const [participants, setParticipants] = useState([]);
  const [spiciness, setSpiciness] = useState(1);
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // --- NOVO ESTADO ---
  // Estado para armazenar o contador global vindo do backend
  const [totalQuestionCount, setTotalQuestionCount] = useState('...'); // Inicia com '...' para indicar carregamento

  // Função para buscar o contador global (reutilizável)
  const fetchTotalCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stats`); // Usa o novo endpoint
      setTotalQuestionCount(response.data.total_questions_served);
    } catch (error) {
      console.error('Erro ao buscar contador total:', error);
      setTotalQuestionCount('Erro'); // Indica que não foi possível buscar
    }
  };

  useEffect(() => {
    // Carrega participantes e spiciness do localStorage (sem alterações)
    const storedParticipants = localStorage.getItem('participants');
    const storedSpiciness = localStorage.getItem('spiciness');
    let parsedParticipants = [];
    let parsedSpiciness = 1;
    if (storedParticipants) parsedParticipants = JSON.parse(storedParticipants);
    if (storedSpiciness) parsedSpiciness = parseInt(storedSpiciness, 10);
    setParticipants(parsedParticipants);
    setSpiciness(parsedSpiciness);

    // Busca a pergunta inicial
    pickNewQuestionAndParticipant(parsedParticipants, parsedSpiciness);

    // --- NOVO ---
    // Busca o contador global inicial ao montar o componente
    fetchTotalCount();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Roda apenas uma vez na montagem

  // Função que sorteia NOVO participante E busca pergunta
  // O backend agora incrementa o contador nesta chamada
  const pickNewQuestionAndParticipant = async (
    pArray = participants,
    spice = spiciness
  ) => {
    if (!pArray.length || isFetchingQuestion) return;
    setIsFetchingQuestion(true);
    const randomIndex = Math.floor(Math.random() * pArray.length);
    const chosenParticipant = pArray[randomIndex];
    setCurrentParticipant(chosenParticipant);
    try {
      // Esta chamada GET agora também dispara o incremento no backend
      const response = await axios.get(`${API_BASE_URL}/api/perguntas?level=${spice}`);
      setCurrentQuestion(response.data.question);
      // NÃO incrementamos mais o contador aqui no frontend
    } catch (error) {
      console.error('Erro ao buscar pergunta:', error);
      setCurrentQuestion('Não foi possível buscar pergunta agora.');
    } finally {
      setIsFetchingQuestion(false);
      // Opcional: Atualizar o contador exibido após cada pergunta?
      // Descomente a linha abaixo se quiser o valor mais recente sempre.
      fetchTotalCount();
    }
  };

  // Função que busca NOVA pergunta para o participante ATUAL com NOVO nível
  // O backend agora incrementa o contador nesta chamada também
  const fetchQuestionForCurrentParticipant = async (newSpiceLevel) => {
      if (!currentParticipant || isFetchingQuestion) return;
      setIsFetchingQuestion(true);
      setSpiciness(newSpiceLevel);
      localStorage.setItem('spiciness', newSpiceLevel);
      try{
        // Esta chamada GET agora também dispara o incremento no backend
        const response = await axios.get(`${API_BASE_URL}/api/perguntas?level=${newSpiceLevel}`);
        setCurrentQuestion(response.data.question);
         // NÃO incrementamos mais o contador aqui no frontend
      } catch (error){
        console.error('Erro ao buscar nova pergunta para o mesmo participante:', error);
        setCurrentQuestion('Não foi possível buscar pergunta agora.');
      } finally {
        setIsFetchingQuestion(false);
        // Opcional: Atualizar o contador exibido após cada pergunta?
        // Descomente a linha abaixo se quiser o valor mais recente sempre.
        fetchTotalCount();
      }
  };

  // Handler para clique nas pimentas (sem alterações na lógica principal)
  const handleClickPepper = (level) => {
    if(level === spiciness || isFetchingQuestion) return;
    if (level === 5){
      setShowWarning(true);
    } else {
      fetchQuestionForCurrentParticipant(level);
    }
  };

  // Handlers do Modal (sem alterações)
  const handleConfirmWarning = () => {
    setShowWarning(false);
    fetchQuestionForCurrentParticipant(5);
  };
  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  // Handler "Próxima Pergunta" (chama a função que sorteia e busca)
  const nextQuestion = () => {
    pickNewQuestionAndParticipant(); // Backend incrementará ao buscar pergunta
  };

  // Handler "Voltar" (sem alterações)
  const goBack = () => {
    window.location.href = '/setup';
  };

  // Texto da pergunta (sem alterações)
  const questionToShow = isFetchingQuestion
    ? 'Carregando...'
    : currentQuestion;

  return (
    <div className="main">
      {/* Pimentas (sem alterações no JSX) */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
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
                  cursor: isFetchingQuestion || level === spiciness ? 'default' : 'pointer',
                  marginRight: '5px',
                  opacity: isFetchingQuestion || level === spiciness ? 0.6 : 1
              }}
              onClick={() => handleClickPepper(level)}
            />
          );
        })}
      </div>

      {/* Participante e Pergunta (sem alterações) */}
      <h3 className="participante-sorteado">{currentParticipant || 'Sorteando...'}</h3>
      <p className="pergunta-sorteada">{questionToShow}</p>

      {/* Botões (sem alterações) */}
      <button
        className="botao"
        onClick={nextQuestion}
        disabled={isFetchingQuestion}
      >
        {isFetchingQuestion ? 'Carregando...' : 'Próxima Pergunta'}
      </button>
      <button className="botao-voltar" onClick={goBack}>
        Voltar
      </button>

      {/* --- NOVO / MODIFICADO --- */}
      {/* Exibe o contador global buscado do backend */}
      <div className="contador-perguntas-global" style={{ marginTop: '15px', fontSize: '0.9em', color: '#aaa' }}> {/* Estilize como preferir */}
        Total de perguntas no app: {totalQuestionCount}
      </div>

      {/* Modal (sem alterações) */}
      <WarningModal
        show={showWarning}
        onClose={handleCloseWarning}
        onConfirm={handleConfirmWarning}
      />
    </div>
  );
}

export default Game;