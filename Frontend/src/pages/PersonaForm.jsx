import { useState } from 'react';
import { createPersona, deletePersona, toggleGanador, updatePersona, getAllPersonas } from '../api/items.api';
import { usePersonas } from '../context/PersonasContext';
import toast from 'react-hot-toast';

export function PersonaForm() {
    const { personas, setPersonas } = usePersonas();
    const [nombre, setNombre] = useState('');
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            setPersonas(prev => prev.map(p => p.id === editingId ? { ...p, nombre } : p));
            setNombre('');
            setEditingId(null);
            try {
                await updatePersona(editingId, { nombre });
                toast.success('Participante actualizado');
            } catch {
                toast.error('Error al actualizar — recargando...');
                getAllPersonas().then(setPersonas);
            }
        } else {
            const tempId = Date.now();
            setPersonas(prev => [...prev, { id: tempId, nombre, ha_ganado: false, _pending: true }]);
            setNombre('');
            try {
                const created = await createPersona({ nombre });
                setPersonas(prev => prev.map(p => p.id === tempId ? created : p));
                toast.success('Participante agregado');
            } catch {
                setPersonas(prev => prev.filter(p => p.id !== tempId));
                toast.error('Error al agregar participante');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este participante?')) return;
        setPersonas(prev => prev.filter(p => p.id !== id));
        try {
            await deletePersona(id);
            toast.success('Participante eliminado');
        } catch {
            toast.error('Error al eliminar — recargando...');
            getAllPersonas().then(setPersonas);
        }
    };

    const handleEdit = (persona) => {
        setNombre(persona.nombre);
        setEditingId(persona.id);
    };

    const handleToggleGanador = async (id) => {
        setPersonas(prev => prev.map(p => p.id === id ? { ...p, ha_ganado: !p.ha_ganado } : p));
        try {
            await toggleGanador(id);
        } catch {
            toast.error('Error al actualizar estado');
            setPersonas(prev => prev.map(p => p.id === id ? { ...p, ha_ganado: !p.ha_ganado } : p));
        }
    };

    const handleCancelEdit = () => {
        setNombre('');
        setEditingId(null);
    };

    const ganadores = personas.filter(p => p.ha_ganado).length;
    const pendientes = personas.filter(p => !p.ha_ganado).length;

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="max-w-5xl mx-auto px-6 py-10">

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-1">Participantes</h2>
                    <p className="text-gray-500 text-sm">Gestiona los participantes del sorteo</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <p className="text-2xl font-bold text-white">{personas.length}</p>
                        <p className="text-gray-500 text-xs mt-1">Total</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <p className="text-2xl font-bold text-indigo-400">{pendientes}</p>
                        <p className="text-gray-500 text-xs mt-1">Disponibles</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <p className="text-2xl font-bold text-yellow-400">{ganadores}</p>
                        <p className="text-gray-500 text-xs mt-1">Ganadores</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6 flex gap-3">
                    <input
                        type="text"
                        placeholder={editingId ? 'Nuevo nombre...' : 'Nombre del participante...'}
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                    <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm whitespace-nowrap">
                        {editingId ? 'Guardar cambios' : '+ Agregar'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold rounded-xl transition-colors text-sm">
                            Cancelar
                        </button>
                    )}
                </form>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="px-6 py-4 text-xs font-semibold tracking-widest uppercase text-gray-500">#</th>
                                <th className="px-4 py-4 text-xs font-semibold tracking-widest uppercase text-gray-500">Nombre</th>
                                <th className="px-4 py-4 text-xs font-semibold tracking-widest uppercase text-gray-500">Estado</th>
                                <th className="px-4 py-4 text-xs font-semibold tracking-widest uppercase text-gray-500 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personas.map((persona, i) => (
                                <tr key={persona.id} className={`border-b border-gray-800/60 last:border-0 transition-colors ${
                                    persona._pending ? 'opacity-60' :
                                    editingId === persona.id ? 'bg-indigo-500/5' : 'hover:bg-gray-800/40'
                                }`}>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{i + 1}</td>
                                    <td className="px-4 py-4">
                                        <span className={`font-medium ${persona.ha_ganado ? 'text-gray-400 line-through' : 'text-white'}`}>
                                            {persona.nombre}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => !persona._pending && handleToggleGanador(persona.id)}
                                            disabled={persona._pending}
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                                persona.ha_ganado
                                                    ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 border border-yellow-400/20'
                                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                            }`}
                                        >
                                            {persona.ha_ganado ? '🏆 Ganador' : '⏳ Pendiente'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => !persona._pending && handleEdit(persona)} disabled={persona._pending}
                                                className="px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/20 rounded-lg transition-colors disabled:opacity-40">
                                                Editar
                                            </button>
                                            <button onClick={() => !persona._pending && handleDelete(persona.id)} disabled={persona._pending}
                                                className="px-3 py-1 text-xs font-semibold text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 rounded-lg transition-colors disabled:opacity-40">
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {personas.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-gray-600 text-sm">
                                        No hay participantes registrados aún
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
