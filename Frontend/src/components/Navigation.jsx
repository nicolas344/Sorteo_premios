import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

export function Navigation() {
    return (
        <nav className="navigation">
            <Link to="/sorteo">Sorteo</Link>
            <Link to="/participantes">Administrar Participantes</Link>
        </nav>
    );
} 