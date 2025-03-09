import { useState, useEffect } from 'react';
import { getAllPersonas, toggleGanador } from '../api/items.api';
import '../styles/SorteoPage.css';
import { Confetti } from '../components/Confetti';

export function SorteoPage() {
    const [personas, setPersonas] = useState([]);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        loadPersonas();
    }, []);

    const loadPersonas = async () => {
        const data = await getAllPersonas();
        const personasDisponibles = data.filter(persona => !persona.ha_ganado);
        setPersonas(personasDisponibles);
    };

    const handleSortear = () => {
        if (isSpinning) return;
        
        setIsSpinning(true);
        const personasDisponibles = personas;
        
        if (personasDisponibles.length === 0) {
            alert('¡No hay personas disponibles para sortear!');
            setIsSpinning(false);
            return;
        }

        // Animación de nombres
        let counter = 0;
        const maxIterations = 30;
        
        const interval = setInterval(() => {
            const randomPersona = personasDisponibles[Math.floor(Math.random() * personasDisponibles.length)];
            setSelectedPersona(randomPersona);
            counter++;
            
            if (counter === maxIterations) {
                clearInterval(interval);
                const ganador = personasDisponibles[Math.floor(Math.random() * personasDisponibles.length)];
                setSelectedPersona(ganador);
                setShowWinnerModal(true);
                setShowConfetti(true);
                setIsSpinning(false);
            }
        }, 100 + (counter * 10));
    };

    const handleConfirmar = async () => {
        if (selectedPersona) {
            try {
                await toggleGanador(selectedPersona.id);
                await loadPersonas();
                setSelectedPersona(null);
                setShowWinnerModal(false);
                setShowConfetti(false);
            } catch (error) {
                alert('Error al confirmar el ganador. Por favor, intenta de nuevo.');
                setShowWinnerModal(false);
                setSelectedPersona(null);
            }
        }
    };

    return (
        <div className="sorteo-container">
            <h1>Sorteo</h1>
            
            <div className="sorteo-central">
                <div className="sorteo-nombres">
                    {selectedPersona && (
                        <div className="nombre-actual">
                            {selectedPersona.nombre}
                        </div>
                    )}
                    <button 
                        className="spin-button"
                        onClick={handleSortear}
                        disabled={isSpinning}
                    >
                        {isSpinning ? 'Sorteando...' : 'Sortear Ganador'}
                    </button>
                </div>
            </div>

            {showWinnerModal && selectedPersona && (
                <>
                    {showConfetti && <Confetti />}
                    <div className="winner-modal">
                        <h2>¡Ganador Seleccionado!</h2>
                        <h3>{selectedPersona.nombre}</h3>
                        <button 
                            className="continue-button"
                            onClick={() => {
                                handleConfirmar();
                                setShowConfetti(false);
                            }}
                        >
                            Confirmar Ganador
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
