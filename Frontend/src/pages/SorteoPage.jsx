import { useState } from 'react';
import { toggleGanador } from '../api/items.api';
import { usePersonas } from '../context/PersonasContext';
import { Confetti } from '../components/Confetti';
import toast from 'react-hot-toast';

export function SorteoPage() {
    const { personas, setPersonas } = usePersonas();
    const disponibles = personas.filter(p => !p.ha_ganado);

    const [selectedPersona, setSelectedPersona] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleSortear = () => {
        if (isSpinning) return;
        if (disponibles.length === 0) {
            toast.error('¡No hay participantes disponibles!');
            return;
        }
        setIsSpinning(true);
        let counter = 0;
        const maxIterations = 15;
        const interval = setInterval(() => {
            setSelectedPersona(disponibles[Math.floor(Math.random() * disponibles.length)]);
            counter++;
            if (counter === maxIterations) {
                clearInterval(interval);
                const ganador = disponibles[Math.floor(Math.random() * disponibles.length)];
                setSelectedPersona(ganador);
                setShowWinnerModal(true);
                setShowConfetti(true);
                setIsSpinning(false);
            }
        }, 80 + counter * 5);
    };

    const handleConfirmar = async () => {
        if (!selectedPersona) return;
        // Optimistic — actualiza el contexto compartido al instante
        setPersonas(prev => prev.map(p => p.id === selectedPersona.id ? { ...p, ha_ganado: true } : p));
        setSelectedPersona(null);
        setShowWinnerModal(false);
        setShowConfetti(false);
        try {
            await toggleGanador(selectedPersona.id);
            toast.success(`¡${selectedPersona.nombre} confirmado como ganador!`);
        } catch {
            // Revertir si falla
            setPersonas(prev => prev.map(p => p.id === selectedPersona.id ? { ...p, ha_ganado: false } : p));
            toast.error('Error al confirmar el ganador.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-10 lg:p-16">

            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-6">
                Sorteo en vivo
            </span>

            <h1 className="text-5xl font-bold mb-2 text-white">Sortear Ganador</h1>
            <p className="text-gray-500 mb-12 text-center">
                {disponibles.length > 0
                    ? `${disponibles.length} participante${disponibles.length !== 1 ? 's' : ''} disponible${disponibles.length !== 1 ? 's' : ''}`
                    : 'No hay participantes disponibles'}
            </p>

            <div className="relative w-full max-w-md mb-8">
                <div className={`rounded-2xl border px-8 py-10 text-center transition-all duration-200 ${
                    isSpinning
                        ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10'
                        : 'border-gray-800 bg-gray-900/60'
                }`}>
                    {selectedPersona ? (
                        <p className={`text-4xl font-bold tracking-tight transition-all ${isSpinning ? 'text-indigo-300' : 'text-white'}`}>
                            {selectedPersona.nombre}
                        </p>
                    ) : (
                        <p className="text-gray-600 text-xl">Presiona el botón para comenzar</p>
                    )}
                </div>
                {isSpinning && (
                    <div className="absolute -inset-px rounded-2xl border border-indigo-500/50 animate-pulse pointer-events-none" />
                )}
            </div>

            <button
                onClick={handleSortear}
                disabled={isSpinning || disponibles.length === 0}
                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
                {isSpinning ? '⏳ Sorteando...' : '🎯 Sortear Ganador'}
            </button>

            {/* Modal ganador */}
            {showWinnerModal && selectedPersona && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    {showConfetti && <Confetti />}
                    <div className="bg-gray-900 border border-gray-700 rounded-3xl p-10 text-center shadow-2xl max-w-sm w-full">
                        <div className="text-6xl mb-4">🏆</div>
                        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-2">¡Tenemos un ganador!</p>
                        <h3 className="text-3xl font-bold text-white mb-8 leading-tight">{selectedPersona.nombre}</h3>
                        <button
                            onClick={handleConfirmar}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-base transition-colors"
                        >
                            Confirmar Ganador
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
