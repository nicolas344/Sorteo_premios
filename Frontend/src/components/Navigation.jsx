import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
    const { pathname } = useLocation();

    const linkClass = (path) =>
        `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === path
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`;

    return (
        <nav className="bg-gray-950 border-b border-gray-800/60 px-6 py-3 flex items-center gap-1">
            <Link to="/sorteo" className="text-white font-bold text-base mr-5 flex items-center gap-2">
                <span className="text-indigo-400">🎯</span> Sorteos
            </Link>
            <Link to="/sorteo" className={linkClass('/sorteo')}>Sorteo</Link>
            <Link to="/participantes" className={linkClass('/participantes')}>Participantes</Link>
        </nav>
    );
}
