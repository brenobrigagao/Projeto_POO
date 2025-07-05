import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Bem-vindo à Floricultura IFCE 
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Encontre as flores mais frescas e belas para presentear ou decorar seu ambiente
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </div>
  );
}