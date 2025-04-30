import React, { useState } from 'react';
import './App.css'; // Make sure this file exists

const GitHubUserFinder = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) throw new Error('User not found');
      const userData = await userResponse.json();
      setUser(userData);
      
      const reposResponse = await fetch(userData.repos_url);
      const reposData = await reposResponse.json();
      setRepos(reposData.slice(0, 5));
    } catch (err) {
      setError(err.message);
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUserData();
  };

  return (
    <div className="container">
      <h1 className="title">GitHub User Finder</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username..."
          />
          <button 
            className="search-button"
            type="submit" 
            disabled={!username.trim() || loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      {loading && <div className="loading">Loading user data...</div>}
      
      {error && (
        <div className="error-message">
          Error: {error}. Please check the username and try again.
        </div>
      )}
      
      {user && (
        <>
          <div className="user-card">
            <img 
              src={user.avatar_url} 
              alt={user.name || user.login} 
              className="avatar"
            />
            <div className="user-info">
              <h2 className="user-name">
                {user.name || user.login}
                {user.login && (
                  <span style={{ color: '#718096', fontSize: '1rem', marginLeft: '0.5rem' }}>
                    @{user.login}
                  </span>
                )}
              </h2>
              
              {user.bio && <p className="user-bio">{user.bio}</p>}
              
              <div className="stats-container">
                <div className="stat">
                  <span className="stat-number">{user.public_repos}</span>
                  <span className="stat-label">Repositories</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{user.followers}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{user.following}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
              
              {user.location && (
                <p style={{ color: '#4a5568', margin: '0.5rem 0' }}>
                  📍 {user.location}
                </p>
              )}
            </div>
          </div>
          
          {repos.length > 0 && (
            <div className="repo-list">
              <h3 className="repo-title">Recent Repositories</h3>
              {repos.map(repo => (
                <div className="repo-item" key={repo.id}>
                  <a 
                    className="repo-name"
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {repo.name}
                  </a>
                  {repo.description && (
                    <p className="repo-desc">{repo.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GitHubUserFinder;