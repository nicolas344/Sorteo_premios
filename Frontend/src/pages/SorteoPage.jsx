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
        try {
            const data = await getAllPersonas();
            const personasDisponibles = data.filter(persona => !persona.ha_ganado);
            setPersonas(personasDisponibles);
        } catch (error) {
            console.error("Error al cargar personas:", error);
        }
    };

    const handleSortear = () => {
        if (isSpinning || personas.length === 0) {
            if (personas.length === 0) {
                alert('¡No hay personas disponibles para sortear!');
            }
            return;
        }
        
        setIsSpinning(true);
        
        let counter = 0;
        const maxIterations = 15;
        
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * personas.length);
            setSelectedPersona(personas[randomIndex]);
            counter++;
            
            if (counter === maxIterations) {
                clearInterval(interval);
                const ganadorIndex = Math.floor(Math.random() * personas.length);
                const ganador = personas[ganadorIndex];
                setSelectedPersona(ganador);
                setShowWinnerModal(true);
                setShowConfetti(true);
                setIsSpinning(false);
            }
        }, 80 + (counter * 5));
    };

    const handleConfirmar = async () => {
        if (selectedPersona) {
            try {
                await toggleGanador(selectedPersona.id);
                
                setPersonas(prevPersonas => 
                    prevPersonas.filter(p => p.id !== selectedPersona.id)
                );
                
                setSelectedPersona(null);
                setShowWinnerModal(false);
                setShowConfetti(false);
            } catch (error) {
                alert('Error al confirmar el ganador.');
                setShowWinnerModal(false);
                setSelectedPersona(null);
            }
        }
    };

    return (
        <div className="sorteo-container">
            <h1>Sorteo</h1>
            <p className="participantes-contador">Participantes restantes: {personas.length}</p>
            
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
                            onClick={handleConfirmar}
                        >
                            Confirmar Ganador
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
