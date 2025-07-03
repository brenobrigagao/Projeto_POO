import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Header() {
  const { token, role, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="bg-green-600 text-white p-4 flex justify-between">
      <div className="font-bold"><Link to="/">FFCE</Link></div>
      <nav className="space-x-4">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registrar</Link>
          </>
        ) : role === 'Cliente' ? (
          <>
            <Link to="/cliente/produtos">Produtos</Link>
            <Link to="/cliente/carrinho">Carrinho</Link>
            <button onClick={() => { logout(); nav('/'); }} className="ml-4">Sair</button>
          </>
        ) : (
          <>
            <Link to="/produtor/flores">Meus Produtos</Link>
            <button onClick={() => { logout(); nav('/'); }} className="ml-4">Sair</button>
          </>
        )}
      </nav>
    </header>
  );
}
