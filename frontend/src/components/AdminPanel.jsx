import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import api from '../services/api';

const AdminPanel = () => {
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({ local: '', visitor: '', date: '' });
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const response = await api.getMatches();
    setMatches(response.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await api.updateMatch(isEditing, form);
    } else {
      // Build payload compatible with backend MatchCreate schema
      const payload = {
        title: `${form.local} vs ${form.visitor}`,
        date: form.date || null,
        venue: null,
        video_path: null,
        home_team_id: null,
        away_team_id: null,
        notes: null,
      };
      await api.createMatch(payload);
    }
    resetForm();
    fetchMatches();
  };

  const handleEdit = (match) => {
    setIsEditing(match.id);
    setForm({ local: match.local, visitor: match.visitor, date: match.date });
  };

  const handleDelete = async (matchId) => {
    await api.deleteMatch(matchId);
    fetchMatches();
  };

  const resetForm = () => {
    setIsEditing(null);
    setForm({ local: '', visitor: '', date: '' });
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        <input name="local" value={form.local} onChange={handleChange} placeholder="Local Team" required />
        <input name="visitor" value={form.visitor} onChange={handleChange} placeholder="Visitor Team" required />
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <button type="submit">{isEditing ? 'Update Match' : 'Create Match'}</button>
        {isEditing && <button onClick={resetForm}>Cancel</button>}
      </form>
      <table>
        <thead>
          <tr>
            <th>Local</th>
            <th>Visitor</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => (
            <tr key={match.id}>
              <td colSpan={1}>{match.title}</td>
              <td>{match.date}</td>
              <td>
                <button onClick={() => handleEdit(match)}>Edit</button>
                <button onClick={() => handleDelete(match.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
