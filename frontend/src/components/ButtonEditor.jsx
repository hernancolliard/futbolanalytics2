import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ButtonEditor.css';

const ButtonEditor = () => {
  const [buttons, setButtons] = useState([]);
  const [form, setForm] = useState({ name: '', color: '#ffffff' });
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    fetchButtons();
  }, []);

  const fetchButtons = async () => {
    const response = await api.getButtons();
    setButtons(response.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await api.updateButton(isEditing, form);
    } else {
      await api.createButton(form);
    }
    resetForm();
    fetchButtons();
  };

  const handleEdit = (button) => {
    setIsEditing(button.id);
    setForm({ name: button.name, color: button.color });
  };

  const handleDelete = async (buttonId) => {
    await api.deleteButton(buttonId);
    fetchButtons();
  };

  const resetForm = () => {
    setIsEditing(null);
    setForm({ name: '', color: '#ffffff' });
  };

  return (
    <div className="button-editor">
      <h2>Editor de Botones</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre del Botón" required />
        <input name="color" type="color" value={form.color} onChange={handleChange} />
        <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
        {isEditing && <button onClick={resetForm}>Cancelar</button>}
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {buttons.map(button => (
            <tr key={button.id}>
              <td>{button.name}</td>
              <td><div style={{ backgroundColor: button.color, width: '100%', height: '20px' }}></div></td>
              <td>
                <button onClick={() => handleEdit(button)}>Editar</button>
                <button onClick={() => handleDelete(button.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ButtonEditor;
