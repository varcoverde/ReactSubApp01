import { Link, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.tsx';

export const Layout = () => {
  const { usuario } = useAuth();

  return (
    <div className="app-container" style={{ width: '100%' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          backgroundColor: '#1d4ed8',
          color: 'white'
        }}
      >
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Central de Leads</h1>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {usuario ? (
            <>
              <div style={{ textAlign: 'right' }}>
                <strong>{usuario.nome}</strong>
                <div style={{ fontSize: '0.85rem' }}>{usuario.email}</div>
              </div>
              {usuario.avatarUrl ? (
                <img
                  src={usuario.avatarUrl}
                  alt={usuario.nome}
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  {usuario.nome.charAt(0)}
                </div>
              )}
            </>
          ) : (
            <span>Identificando usuário...</span>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
