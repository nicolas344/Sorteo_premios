import { useEffect } from 'react';
import '../styles/SorteoPage.css';

export function Confetti() {
    useEffect(() => {
        const confettiCount = 150;
        const container = document.createElement('div');
        container.className = 'confetti';
        document.body.appendChild(container);

        const colors = ['#ffd700', '#ff0000', '#00ff00', '#0000ff', '#ff00ff'];

        for (let i = 0; i < confettiCount; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.animation = `confettiRain ${3 + Math.random() * 2}s linear`;
            piece.style.opacity = '1';
            piece.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(piece);
        }

        return () => {
            document.body.removeChild(container);
        };
    }, []);

    return null;
} 