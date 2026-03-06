import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PersonasProvider } from './context/PersonasContext';
import { SorteoPage } from './pages/SorteoPage';
import { PersonaForm } from './pages/PersonaForm';
import { Navigation } from './components/Navigation';

function App() {
    return (
        <BrowserRouter>
            <PersonasProvider>
                <Toaster position="top-right" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />
                <Navigation />
                <Routes>
                    <Route path="/" element={<Navigate to="/sorteo" />} />
                    <Route path="/sorteo" element={<SorteoPage />} />
                    <Route path="/participantes" element={<PersonaForm />} />
                </Routes>
            </PersonasProvider>
        </BrowserRouter>
    );
}

export default App;