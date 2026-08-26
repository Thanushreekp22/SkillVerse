import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Work, Check, Tag, Bulb } from '../components/icons';
import api from '../api/axios';

const LEVEL_LABELS = { 1: 'Beginner', 2: 'Novice', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' };

const matchColor = (p) => {
  if (p >= 70) return 'var(--sky, #0ea5e9)';
  if (p >= 45) return 'var(--primary, #2563eb)';
  if (p >= 25) return 'var(--warning, #f59e0b)';
  return 'var(--muted, #94a3b8)';
};

const JobMatch = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/job-match');
      setData(data);
    } catch (error) {
      console.error('Job match load error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  const matches = data?.matches || [];

  if (!data?.hasSkills || matches.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="big-icon">
            <Work size={48} />
          </div>
          <h2>No Skills Yet</h2>
          <p>{data?.message || 'Add your skills to see which job roles match your profile!'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/app/skills')}>
            Add Skills
          </button>
        </div>
      </div>
    );
  }

  const top = matches.filter((m) => m.percent > 0)[0];

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>Job Matching 🎯</h1>
          <p className="sub">Your skills matched against {matches.length} job roles, ranked by fit.</p>
        </div>
      </div>

      {top && (
        <div className="recommend">
          <div className="tag">
            <Bulb size={18} /> Top Match Recommendation
          </div>
          <h2>
            {top.title} — {top.percent}% match
          </h2>
          <p>
            {top.matchedCount} of {top.requiredCount} required skills matched.
          </p>
          {top.missingSkills.length > 0 && (
            <>
              <div className="learn">To strengthen this match, consider learning:</div>
              <div className="chips" style={{ marginTop: 8 }}>
                {top.missingSkills.slice(0, 4).map((ms, i) => (
                  <span className="chip chip-white-on-blue" key={i}>
                    {ms.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="row">
        {matches.map((m, idx) => (
          <div className="col-6" key={idx}>
            <div className="match-card">
              <div className="match-top">
                <div>
                  <div className="match-title">{m.title}</div>
                  <div className="match-category">{m.category}</div>
                </div>
                <div className="match-percent">
                  <div className="num" style={{ color: matchColor(m.percent) }}>
                    {m.percent}%
                  </div>
                  <div className="lbl">match</div>
                </div>
              </div>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${m.percent}%`, background: matchColor(m.percent) }}
                />
              </div>

              <p className="match-desc">{m.description}</p>

              {m.matchedSkills.length > 0 && (
                <div>
                  <div className="match-block-title green">
                    <Check size={14} /> Matched Skills ({m.matchedSkills.length})
                  </div>
                  <div className="chips">
                    {m.matchedSkills.map((ms, i) => (
                      <span className="chip chip-green" key={i}>
                        {ms.name} · {LEVEL_LABELS[ms.level]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {m.missingSkills.length > 0 && (
                <div>
                  <div className="match-block-title orange">
                    <Tag size={14} /> Missing Skills ({m.missingSkills.length}) — Suggestions
                  </div>
                  <div className="chips">
                    {m.missingSkills.map((ms, i) => (
                      <span className="chip chip-orange" key={i}>
                        {ms.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="match-foot">
                {m.matchedCount} / {m.requiredCount} required skills in your profile
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobMatch;