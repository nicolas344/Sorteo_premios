const API_BASE_URL = 'http://34.51.4.194:8000/Sorteos/api/v1';

export const getAllPersonas = async () => {
    const response = await fetch(`${API_BASE_URL}/personas/`);
    return await response.json();
};

export const createPersona = async (persona) => {
    const response = await fetch(`${API_BASE_URL}/personas/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(persona)
    });
    return await response.json();
};

export const updatePersona = async (id, persona) => {
    const response = await fetch(`${API_BASE_URL}/personas/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(persona)
    });
    return await response.json();
};

export const deletePersona = async (id) => {
    await fetch(`${API_BASE_URL}/personas/${id}/`, {
        method: 'DELETE'
    });
};

export const toggleGanador = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/personas/${id}/toggle_ganador/`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            // Si el servidor responde con un error, leer el mensaje
            const errorData = await response.json();
            console.log("Error en toggleGanador:", errorData);
            
            // Si la persona ya ganó, no es un error crítico
            if (response.status === 400 && errorData.status === 'Esta persona ya ha ganado') {
                console.log("Ignorando error, la persona ya estaba marcada como ganadora");
                return { status: 'ok', alreadyWinner: true };
            }
            
            throw new Error(`Error al marcar ganador: ${errorData.status || response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error en toggleGanador:", error);
        throw error;
    }
};