import React from 'react';

const SobreNos: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '10px' }}>Finance Smart</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Versão 1.0.0</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>O Projeto</h3>
        <p style={{ lineHeight: '1.6', color: 'var(--color-text)' }}>
          O Finance Smart foi desenvolvido para ajudar você a ter controle total sobre sua vida financeira. 
          Organize receitas, despesas e alcance seus objetivos com simplicidade.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Desenvolvedores</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
            <strong>Sua Equipe</strong>
            <br />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Engenharia de Software</span>
          </li>
        </ul>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          © 2025 Finance Smart. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default SobreNos;