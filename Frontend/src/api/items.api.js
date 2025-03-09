const API_BASE_URL = 'http://34.51.20.186:8000/Sorteos/api/v1';

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
    const response = await fetch(`${API_BASE_URL}/personas/${id}/toggle_ganador/`, {
        method: 'POST'
    });
    return await response.json();
};