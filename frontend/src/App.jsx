import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('Checking backend connection...');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [targetCareer, setTargetCareer] = useState('Full Stack Engineer');
  const [result, setResult] = useState(null);

  // Available skills pool for user to choose from
  const availableSkills = [
    'Java', 'Spring Boot', 'React', 'Python', 'Docker', 
    'SQL', 'Git', 'Linux', 'AWS', 'Machine Learning', 
    'Pandas', 'TensorFlow', 'Kubernetes', 'Networking', 'Ethical Hacking'
  ];

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then((res) => {
        if (!res.ok) throw new Error('HTTP error! status: ' + res.status);
        return res.text();
      })
      .then((data) => setStatus(data))
      .catch((err) => {
        console.error('Error connecting to backend:', err);
        setStatus('Connection Failed: Make sure Spring Boot is running on port 8080');
      });
  }, []);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0) return;

    const skillListLower = selectedSkills.map(s => s.toLowerCase());

    const roleRequirements = {
      'Full Stack Engineer': ['java', 'spring boot', 'react', 'docker', 'sql', 'git'],
      'Data Scientist': ['python', 'pandas', 'machine learning', 'sql', 'docker'],
      'Cybersecurity Analyst': ['networking', 'linux', 'ethical hacking', 'python'],
      'Cloud / DevOps Engineer': ['aws', 'docker', 'kubernetes', 'linux'],
      'AI / ML Engineer': ['python', 'tensorflow', 'machine learning', 'docker']
    };

    const requiredSkills = roleRequirements[targetCareer] || ['java', 'react', 'git'];
    const missing = requiredSkills.filter(skill => !skillListLower.includes(skill));
    const matchScore = Math.round(((requiredSkills.length - missing.length) / requiredSkills.length) * 100);

    setResult({
      targetCareer,
      matchScore,
      missingSkills: missing.length > 0 ? missing : ['None! You are fully prepared for this role.'],
      recommendation: missing.length > 0 
        ? `Focus on mastering ${missing.slice(0, 2).join(' and ')} to close your skill gap.`
        : 'Your current skill profile matches this target role perfectly!'
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', fontFamily: 'Arial, sans-serif', padding: '1rem', color: '#fff' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Skill Gap Career Recommender</h1>
        <h2 style={{ color: status.includes('successfully') ? '#4ade80' : '#f87171', fontSize: '1rem' }}>
          {status}
        </h2>
      </header>

      <form onSubmit={handleAnalyze} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Target Career Role:</label>
          <select 
            value={targetCareer} 
            onChange={(e) => setTargetCareer(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
          >
            <option value="Full Stack Engineer">Full Stack Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
            <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
            <option value="AI / ML Engineer">AI / ML Engineer</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Your Current Skills (click to choose):</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: '20px',
                    border: '1px solid #334155',
                    background: isSelected ? '#3b82f6' : '#0f172a',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          type="submit" 
          style={{ padding: '0.8rem', borderRadius: '6px', background: '#10b981', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
        >
          Analyze Skill Gap
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '2rem', background: '#0f172a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <h2>Assessment Results</h2>
          <p><strong>Target Role:</strong> {result.targetCareer}</p>
          <p><strong>Skill Match:</strong> <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{result.matchScore}%</span></p>
          
          <h3 style={{ marginTop: '1rem' }}>Missing / Recommended Skills:</h3>
          <ul>
            {result.missingSkills.map((skill, idx) => (
              <li key={idx} style={{ textTransform: 'capitalize', margin: '0.3rem 0' }}>{skill}</li>
            ))}
          </ul>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#1e293b', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
            <strong>Action Plan:</strong> {result.recommendation}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;