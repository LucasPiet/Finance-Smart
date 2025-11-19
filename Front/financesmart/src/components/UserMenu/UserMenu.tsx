// src/components/UserMenu/UserMenu.tsx
import React, { useState } from 'react';
// --- CORREÇÃO: Import de CSS removido ---

// --- Ícones SVG para o Menu ---
const IconEmail = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconDelete = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
// --- Fim dos Ícones ---

interface UserMenuProps {
  userEmail: string;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ userEmail, onLogout, onDeleteAccount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="user-menu-container">
      {/* Botão de ícone do usuário */}
      <button className="user-icon-button" onClick={toggleMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </button>

      {/* Card do Menu (quando aberto) */}
      {isOpen && (
        <div className="user-menu-card">
          {/* Item E-mail */}
          <div className="user-menu-item email-display">
            <div className="user-menu-item-icon"><IconEmail /></div>
            <div className="user-menu-item-text">
              <span>E-mail</span>
              <p>{userEmail}</p>
            </div>
          </div>
          
          {/* Item Desconectar */}
          <button className="user-menu-item" onClick={onLogout}>
            <div className="user-menu-item-icon"><IconLogout /></div>
            <div className="user-menu-item-text">
              <span>Desconectar-se</span>
              <small>Sair da sua conta</small>
            </div>
          </button>
          
          {/* Item Apagar Conta */}
          <button className="user-menu-item delete-account" onClick={onDeleteAccount}>
            <div className="user-menu-item-icon"><IconDelete /></div>
            <div className="user-menu-item-text">
              <span>Apagar conta</span>
              <small>Apagar minha conta e meus dados</small>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;