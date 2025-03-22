import { useState, useEffect } from 'react';
import { getAllPersonas, createPersona, deletePersona, toggleGanador, updatePersona } from '../api/items.api';
import '../styles/PersonaForm.css';

export function PersonaForm() {
    const [personas, setPersonas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadPersonas();
    }, []);

    const loadPersonas = async () => {
        const data = await getAllPersonas();
        setPersonas(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updatePersona(editingId, { nombre });
                setEditingId(null);
            } else {
                await createPersona({ nombre });
            }
            setNombre('');
            loadPersonas();
        } catch (error) {
            alert('Error al guardar el participante');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar este participante?')) {
            await deletePersona(id);
            loadPersonas();
        }
    };

    const handleEdit = (persona) => {
        setNombre(persona.nombre);
        setEditingId(persona.id);
    };

    const handleToggleGanador = async (id) => {
        try {
            await toggleGanador(id);
            await loadPersonas();
        } catch (error) {
            console.error("Error al cambiar estado de ganador:", error);
            alert("Hubo un error al actualizar el estado del participante");
        }
    };

    const handleCancelEdit = () => {
        setNombre('');
        setEditingId(null);
    };

    return (
        <div className="admin-container">
            <h2>Gestión de Participantes</h2>
            
            <form onSubmit={handleSubmit} className="persona-form">
                <input
                    type="text"
                    placeholder="Nombre del participante"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                />
                <div className="form-buttons">
                    <button type="submit">
                        {editingId ? 'Actualizar Participante' : 'Agregar Participante'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="cancel-button">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="personas-list">
                <h3>Participantes Registrados</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personas.map(persona => (
                            <tr key={persona.id} className={persona.ha_ganado ? 'ganador' : ''}>
                                <td>{persona.nombre}</td>
                                <td>
                                    <button 
                                        onClick={() => handleToggleGanador(persona.id)}
                                        className={persona.ha_ganado ? 'ganador-btn' : 'no-ganador-btn'}
                                    >
                                        {persona.ha_ganado ? 'Quitar Ganador' : 'Pendiente'}
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleEdit(persona)}
                                        className="edit-button"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(persona.id)}
                                        className="delete-button"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 