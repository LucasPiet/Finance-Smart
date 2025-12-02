import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Ícones SVG ---
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconInfo = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;

// --- Componente AppMenu ---ger
const AppMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };


  return (
    <div className="app-menu-container">
      <button className="icon-btn" aria-label="Menu" onClick={toggleMenu}>
        <IconMenu />
      </button>

      {isOpen && (
        <div className="app-menu-card">
          {/* Opção: Sobre Nós (Nova) */}
          <button className="user-menu-item" onClick={() => handleNavigation('/sobre-nos')}>
            <div className="user-menu-item-icon"><IconInfo /></div>
            <div className="user-menu-item-text">
              <span>Sobre nós</span>
              <small>Informações e versão</small>
            </div>
          </button>
          

        </div>
      )}
    </div>
  );
};

export default AppMenu;