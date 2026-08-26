import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ALL_SKILLS, SKILL_GROUPS } from '../data/skillsList';
import { Plus, Trash, Sparkle, Tag } from '../components/icons';

const LEVEL_LABELS = { 1: 'Beginner', 2: 'Novice', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' };

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addLevel, setAddLevel] = useState(3);
  const [editLevel, setEditLevel] = useState({});
  const [saving, setSaving] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadSkills = useCallback(async () => {
    try {
      const [skillsRes, suggRes] = await Promise.all([
        api.get('/skills'),
        api.get('/skills/suggestions'),
      ]);
      setSkills(skillsRes.data.skills || []);
      setSuggestions(suggRes.data.suggestions || []);
    } catch (error) {
      console.error('Load skills error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const handleAdd = async () => {
    if (!addName.trim()) {
      toast.error('Please enter a skill name.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/skills', { name: addName.trim(), level: addLevel });
      toast.success(data.message);
      setAddOpen(false);
      setAddName('');
      setAddLevel(3);
      await loadSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateLevel = async (id) => {
    setSaving((prev) => ({ ...prev, [id]: true }));
    try {
      const { data } = await api.put(`/skills/${id}`, { level: editLevel[id] });
      toast.success(data.message);
      await loadSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update skill.');
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (skill) => {
    if (!window.confirm(`Remove "${skill.name}" from your skills?`)) return;
    try {
      const { data } = await api.delete(`/skills/${skill._id}`);
      toast.success(data.message);
      await loadSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete skill.');
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  const allOptions = [...new Set([...ALL_SKILLS, ...suggestions])];

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>My Skills</h1>
          <p className="sub">Add and manage the skills you have and their proficiency level.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <Plus size={16} /> Add Skill
        </button>
      </div>
<div className="row">
        <div className="col-7">
          <div className="panel">
            <h3 className="panel-title">My Skill Set ({skills.length})</h3>
            {skills.length === 0 ? (
              <div className="alert alert-info">
                <span>
                  You don't have any skills yet. Click "Add Skill" or pick from the suggestions!
                </span>
              </div>
            ) : (
              <div className="skill-grid">
                {skills.map((skill) => {
                  const current = editLevel[skill._id] ?? skill.level;
                  const isSaving = saving[skill._id];
                  return (
                    <div className="skill-card" key={skill._id}>
                      <div className="top">
                        <span className="name">{skill.name}</span>
                        <button
                          className="icon-btn"
                          onClick={() => handleDelete(skill)}
                          title="Remove skill"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                      <div className="level-row">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={current}
                          onChange={(e) =>
                            setEditLevel((prev) => ({
                              ...prev,
                              [skill._id]: Number(e.target.value),
                            }))
                          }
                        />
                        <span className="chip chip-blue">
                          {current} · {LEVEL_LABELS[current]}
                        </span>
                        <button
                          className="btn btn-sm btn-ghost"
                          disabled={isSaving || current === skill.level}
                          onClick={() => handleUpdateLevel(skill._id)}
                        >
                          {isSaving ? '…' : 'Save'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="col-5">
          <div className="panel suggestion-panel" style={{ height: '100%' }}>
            <h3 className="panel-title">
              <Sparkle size={18} /> Suggested Skills
            </h3>
            <p className="sub" style={{ marginBottom: 14 }}>
              Popular skills you haven't added yet.
            </p>
            {suggestions.length === 0 ? (
              <p style={{ color: 'var(--success)' }}>You've covered all suggestions! 🎉</p>
            ) : (
              <div className="chips">
                {suggestions.slice(0, 15).map((s, i) => (
                  <button
                    key={i}
                    className="chip chip-green suggestion-chip clickable"
                    onClick={() => {
                      setAddName(s);
                      setAddLevel(3);
                      setAddOpen(true);
                    }}
                  >
                    <Tag size={13} /> {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
{addOpen && (
        <div className="modal-overlay" onClick={() => setAddOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add a Skill</h3>

            <div className="field">
              <label htmlFor="skill-name">Skill Name</label>
              <input
                id="skill-name"
                className="input"
                list="skill-options"
                autoFocus
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Type or pick a skill"
              />
              <datalist id="skill-options">
                {allOptions.map((opt, i) => (
                  <option key={i} value={opt} />
                ))}
              </datalist>
            </div>

            <p className="hint">Proficiency Level</p>
            <div className="range-row">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={addLevel}
                onChange={(e) => setAddLevel(Number(e.target.value))}
              />
              <span className="chip chip-blue">
                {addLevel} · {LEVEL_LABELS[addLevel]}
              </span>
            </div>

            <div className="quick-skills">
              {SKILL_GROUPS.slice(0, 3).map((group) =>
                group.skills.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    className="quick-skill"
                    onClick={() => setAddName(s)}
                    type="button"
                  >
                    {s}
                  </button>
                ))
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySkills;