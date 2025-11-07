import { Link, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.tsx';

export const Layout = () => {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen w-full bg-slate-100">
      <header className="flex items-center justify-between bg-blue-600 px-8 py-6 text-white shadow-lg">
        <Link to="/" className="text-white no-underline">
          <h1 className="text-2xl font-semibold">Central de Leads</h1>
        </Link>
        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <div className="text-right">
                <strong className="block text-sm font-semibold">{usuario.nome}</strong>
                <div className="text-xs text-blue-100">{usuario.email}</div>
              </div>
              {usuario.avatarUrl ? (
                <img src={usuario.avatarUrl} alt={usuario.nome} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-sm font-semibold">
                  {usuario.nome.charAt(0)}
                </div>
              )}
            </>
          ) : (
            <span className="text-sm text-blue-100">Identificando usuário...</span>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
};
