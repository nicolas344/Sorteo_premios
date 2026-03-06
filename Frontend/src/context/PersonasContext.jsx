import { createContext, useContext, useEffect, useState } from 'react';
import { getAllPersonas } from '../api/items.api';

const PersonasContext = createContext(null);

export function PersonasProvider({ children }) {
    const [personas, setPersonas] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getAllPersonas().then(data => {
            setPersonas(data);
            setLoaded(true);
        });
    }, []);

    return (
        <PersonasContext.Provider value={{ personas, setPersonas, loaded }}>
            {children}
        </PersonasContext.Provider>
    );
}

export function usePersonas() {
    return useContext(PersonasContext);
}
