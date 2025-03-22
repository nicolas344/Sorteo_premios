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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.status || "Error al cambiar estado del participante");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error en toggleGanador:", error);
        throw error;
    }
};