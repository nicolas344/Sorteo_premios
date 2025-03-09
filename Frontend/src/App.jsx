import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import { SorteoPage } from './pages/SorteoPage';
import { PersonaForm } from './pages/PersonaForm';
import { Navigation } from './components/Navigation';

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<Navigate to="/sorteo" />} />
                <Route path="/sorteo" element={<SorteoPage />} />
                <Route path="/participantes" element={<PersonaForm />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;