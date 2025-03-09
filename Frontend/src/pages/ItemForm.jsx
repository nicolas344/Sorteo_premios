import { useState, useEffect } from 'react';
import { createItem, getAllItems, deleteItem, updateItem, toggleEstadoItem } from '../api/items.api';
import '../styles/ItemForm.css';

export function ItemForm() {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        numero: '',
        nombre: '',
        imagen: null,
        probabilidad: 1.0,
        valor: 0,
        descripcion: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getAllItems();
        setItems(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateItem(editingId, formData);
        } else {
            await createItem(formData);
        }
        setFormData({
            numero: '',
            nombre: '',
            imagen: null,
            probabilidad: 1.0,
            valor: 0,
            descripcion: ''
        });
        setEditingId(null);
        loadItems();
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar este item?')) {
            await deleteItem(id);
            loadItems();
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setEditingId(item.id);
    };

    const handleToggleEstado = async (id) => {
        await toggleEstadoItem(id);
        loadItems();
    };

    return (
        <div className="admin-container">
            <h2>{editingId ? 'Editar Item' : 'Crear Nuevo Item'}</h2>
            
            <form onSubmit={handleSubmit} className="item-form">
                <input
                    type="number"
                    placeholder="Número"
                    value={formData.numero}
                    onChange={e => setFormData({...formData, numero: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                />
                <input
                    type="file"
                    onChange={e => setFormData({...formData, imagen: e.target.files[0]})}
                />
                <button type="submit">
                    {editingId ? 'Actualizar' : 'Crear'}
                </button>
            </form>

            <div className="items-list">
                <h3>Items Existentes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Ganador</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.numero}</td>
                                <td>{item.nombre}</td>
                                <td>
                                    <button 
                                        onClick={() => handleToggleEstado(item.id)}
                                        className={item.entregado ? 'entregado' : 'disponible'}
                                    >
                                        {item.entregado ? 'Entregado' : 'Disponible'}
                                    </button>
                                </td>
                                <td>{item.ganador_nombre || '-'}</td>
                                <td>
                                    <button onClick={() => handleEdit(item)}>Editar</button>
                                    <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
