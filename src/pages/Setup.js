import React, { useState } from 'react';

function Setup() {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState('');
  const [spiciness, setSpiciness] = useState(1);

  const addParticipant = () => {
    if (name.trim()) {
      setParticipants([...participants, name.trim()]);
      setName('');
    }
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleClickPepper = (level) => {
    setSpiciness(level);
  };

  const startGame = () => {
    if (participants.length === 0) {
      alert('É preciso adicionar pelo menos um participante para iniciar o jogo!');
      return;
    }
  
    localStorage.setItem('participants', JSON.stringify(participants));
    localStorage.setItem('spiciness', spiciness);
    window.location.href = '/game';
  };

  return (
    <div className='main'>
      <img className='pimenta_branca' src='images/pimenta_branca.png' alt='vetor de uma pimenta branca' />
      <h2 className='participantes-title'>Participantes</h2>
      <div className='participantes-form'>
        <input className='input-participantes'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do participante"
        />
        <button className='botao-add-participantes' onClick={addParticipant}>Adicionar</button>
        <ul className='lista-participantes'>
          {participants.map((p, i) => (
            <li key={i}>
              {p} <button onClick={() => removeParticipant(i)}>X</button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Renderizar as 5 pimentas, clicáveis */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((level) => {
          // Definir a imagem correta (vermelha ou cinza)
          const pepperImg = level <= spiciness
            ? '/images/pimenta_vermelha.png'
            : '/images/pimenta_cinza.png';

          return (
            <img
              key={level}
              src={pepperImg}
              alt={level <= spiciness ? 'Pimenta Vermelha' : 'Pimenta Cinza'}
              style={{ width: '50px', cursor: 'pointer', marginRight: '5px', paddingBottom: '20px' }}
              onClick={() => handleClickPepper(level)} // ao clicar, muda o spiciness
            />
          );
        })}
      </div>

      <button className='botao' onClick={startGame}>Começar</button>
    </div>
  );
}

export default Setup;
