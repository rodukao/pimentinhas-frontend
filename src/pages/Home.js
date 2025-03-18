import React from 'react';

function Home() {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado para a área de transferência!");
  };

  return (
    <div className='main'>
      <img className='logo' src='images/logo.png' alt='logo pimentinhas' />
      <h2 className='pimentinhas-title'>Pimenta nos olhos dos outros é refresco!</h2>
      <button className='botao' onClick={() => window.location.href = '/setup'}>
        Novo Jogo
      </button>
      <button className='botao-compartilhar' onClick={copyLink}>
        <img src='images/compartilhar.png' alt='botao_compartilhar' />
      </button>
    </div>
  );
}

export default Home;
