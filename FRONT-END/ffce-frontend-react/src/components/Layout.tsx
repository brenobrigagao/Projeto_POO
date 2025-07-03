import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#0077cc', color: '#fff' }}>
        <Link to="/" style={{ marginRight: '1rem', color: 'white' }}>Home</Link>
        <Link to="/login" style={{ marginRight: '1rem', color: 'white' }}>Login</Link>
        <Link to="/register" style={{ marginRight: '1rem', color: 'white' }}>Cadastro</Link>
        <Link to="/cliente/produtos" style={{ marginRight: '1rem', color: 'white' }}>Produtos (Cliente)</Link>
        <Link to="/produtor/flores" style={{ marginRight: '1rem', color: 'white' }}>Flores (Produtor)</Link>
      </nav>
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
