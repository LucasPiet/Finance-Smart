import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Ícones SVG ---
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconInfo = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;


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

  const handleEditMode = () => {
    setIsOpen(false);
    // Aqui você pode navegar para uma tela de "Gerenciar Despesas" ou abrir um modal
    alert("Funcionalidade: Habilitar edição de despesas");
    console.log("Modo de edição ativado");
  };

  return (
    <div className="app-menu-container">
      <button className="icon-btn" aria-label="Menu" onClick={toggleMenu}>
        <IconMenu />
      </button>

      {isOpen && (
        <div className="app-menu-card">
          
          {/* Opção: Editar Despesas */}
          <button className="user-menu-item" onClick={handleEditMode}>
            <div className="user-menu-item-icon"><IconEdit /></div>
            <div className="user-menu-item-text">
              <span>Editar Despesas</span>
              <small>Gerenciar lançamentos</small>
            </div>
          </button>

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