import React from 'react';

function dificuldade({ spiciness }) {
  const peppers = [];

  for (let i = 1; i <= 5; i++) {
    // Se o índice for menor ou igual ao nível, uso a vermelha, senão a cinza
    const pepperImg = i <= spiciness
      ? '/images/pimenta_vermelha.png'
      : '/images/pimenta_cinza.png';

    peppers.push(
      <img
        key={i}
        src={pepperImg}
        alt={i <= spiciness ? 'Pimenta Vermelha' : 'Pimenta Cinza'}
        style={{ width: '40px', marginRight: '5px' }}
      />
    );
  }

  return <>{peppers}</>;
}

export default dificuldade;