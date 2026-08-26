import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Work, Plus, Trophy } from '../components/icons';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [skillsRes, matchRes] = await Promise.all([
        api.get('/skills'),
        api.get('/job-match'),
      ]);
      setSkills(skillsRes.data.skills || []);
      setMatchData(matchRes.data);
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  const topMatch = matchData?.matches?.find((m) => m.percent > 0);
  const avgPercent = matchData?.matches?.length
    ? Math.round(
        matchData.matches.reduce((acc, m) => acc + m.percent, 0) / matchData.matches.length
      )
    : 0;

  const chartData = (matchData?.matches || []).slice(0, 6).map((m) => ({
    name: m.title.split(' ').slice(0, 2).join(' ') || m.title,
    fullName: m.title,
    percent: m.percent,
  }));

  const statCards = [
    { label: 'Skills Added', value: skills.length, icon: <Plus size={22} />, cls: 'icon-box' },
    { label: 'Average Match', value: `${avgPercent}%`, icon: <Trophy size={22} />, cls: 'icon-box green' },
    {
      label: 'Best Role',
      value: topMatch ? `${topMatch.percent}%` : '—',
      sub: topMatch?.title || 'Add skills to match',
      icon: <Work size={22} />,
      cls: 'icon-box orange',
    },
  ];

  const barFill = (p) =>
    p >= 60 ? 'var(--sky, #0ea5e9)' : p >= 40 ? 'var(--primary, #2563eb)' : '#93c5fd';

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="sub">Here's your skill progress and job match overview.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/skills')}>
          <Plus size={16} /> Add Skills
        </button>
      </div>

      {skills.length === 0 && (
        <div className="alert alert-info">
          <span>You haven't added any skills yet. Add your skills to find matching job roles!</span>
          <span className="alert-actions">
            <button className="btn btn-sm btn-outline" onClick={() => navigate('/app/skills')}>
              Get Started
            </button>
          </span>
        </div>
      )}

      <div className="stat-grid">
        {statCards.map((card, idx) => (
          <div className="stat-card" key={idx}>
            <span className={card.cls}>{card.icon}</span>
            <div>
              <div className="label">{card.label}</div>
              <div className="value">{card.value}</div>
              {card.sub && <div className="sub">{card.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-5">
          <div className="panel" style={{ height: '100%' }}>
            <h3 className="panel-title">Your Top Skills</h3>
            {skills.length === 0 ? (
              <p className="sub">No skills added yet.</p>
            ) : (
              <div className="chips">
                {skills.slice(0, 10).map((s, i) => (
                  <span className="chip chip-blue" key={i}>
                    {s.name} ({s.level})
                  </span>
                ))}
              </div>
            )}
            <div style={{ marginTop: 18 }}>
              <button className="btn btn-outline" onClick={() => navigate('/app/skills')}>
                Manage Skills
              </button>
            </div>
          </div>
        </div>

        <div className="col-7">
          <div className="panel">
            <h3 className="panel-title">Match % by Job Role</h3>
            {chartData.length === 0 ? (
              <p className="sub">Add skills to see your job match chart.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={110} />
                  <Tooltip
                    formatter={(v) => [`${v}%`, 'Match']}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                  />
                  <Bar dataKey="percent" radius={[0, 6, 6, 0]} barSize={22}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={barFill(entry.percent)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button className="btn btn-sky" onClick={() => navigate('/app/job-match')}>
                View Full Job Match
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;