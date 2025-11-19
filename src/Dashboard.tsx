import React, { useEffect, useState } from 'react';
import { getTopTracks, getTopArtists, TimeRange } from './spotify';
import { SpotifyTrack, SpotifyArtist } from './types';
import ThemeToggle from './ThemeToggle';
import './Dashboard.css';

interface DashboardProps {
  token: string;
  onLogout: () => void;
  isLight: boolean;
  toggleTheme: () => void;
}

type ViewType = 'tracks' | 'artists';

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout, isLight, toggleTheme }) => {
  const [view, setView] = useState<ViewType>('tracks');
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(false);
  
  const cache = React.useRef<Record<string, { promise: Promise<any>, data?: any }>>({});

  // Helper to fetch and cache data
  const loadData = (v: ViewType, r: TimeRange) => {
    const key = `${v}-${r}`;
    if (cache.current[key]) return cache.current[key].promise;

    const promise = v === 'tracks' 
        ? getTopTracks(token, r) 
        : getTopArtists(token, r);
    
    const entry = { promise, data: undefined };
    cache.current[key] = entry;

    promise
        .then((data: any) => { entry.data = data; })
        .catch((err: any) => console.debug(`Background fetch error ${key}`, err));

    return promise;
  };

  // Prefetch all data in background
  useEffect(() => {
    const views: ViewType[] = ['tracks', 'artists'];
    const ranges: TimeRange[] = ['short_term', 'medium_term', 'long_term'];
    views.forEach(v => ranges.forEach(r => loadData(v, r)));
  }, [token]);

  // Main data loader
  useEffect(() => {
    let isMounted = true;
    const key = `${view}-${timeRange}`;
    
    const cached = cache.current[key];
    
    // If data is ready, show it instantly
    if (cached?.data) {
       if (view === 'tracks') setTracks(cached.data);
       else setArtists(cached.data);
       setLoading(false); 
       return;
    }

    // Otherwise show loading state
    setLoading(true);
    
    // Ensure fetching
    const promise = loadData(view, timeRange);
    
    promise.then(data => {
        if (isMounted) {
             if (view === 'tracks') setTracks(data);
             else setArtists(data);
        }
    }).catch(err => {
        if (isMounted) {
            console.error("Error fetching data", err);
             if ((err as Error).message.includes("Token expired")) {
                 onLogout();
             }
        }
    }).finally(() => {
        if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [view, timeRange, token, onLogout]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Your Top {view === 'tracks' ? 'Tracks' : 'Artists'}</h1>
        <div className="header-actions">
          <ThemeToggle isLight={isLight} toggleTheme={toggleTheme} />
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="controls">
        <div className="toggle-group">
          <button 
            className={view === 'tracks' ? 'active' : ''} 
            onClick={() => setView('tracks')}
          >
            Top Tracks
          </button>
          <button 
            className={view === 'artists' ? 'active' : ''} 
            onClick={() => setView('artists')}
          >
            Top Artists
          </button>
        </div>

        <div className="toggle-group">
          <button 
            className={timeRange === 'short_term' ? 'active' : ''} 
            onClick={() => setTimeRange('short_term')}
          >
            4 Weeks
          </button>
          <button 
            className={timeRange === 'medium_term' ? 'active' : ''} 
            onClick={() => setTimeRange('medium_term')}
          >
            6 Months
          </button>
          <button 
            className={timeRange === 'long_term' ? 'active' : ''} 
            onClick={() => setTimeRange('long_term')}
          >
            All Time
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="grid">
          {view === 'tracks' ? (
            tracks.map((track, index) => (
              <div key={track.id} className="card fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="rank">#{index + 1}</div>
                <img src={track.album.images[0]?.url} alt={track.name} />
                <div className="card-info">
                  <h3>{track.name}</h3>
                  <p>{track.artists.map(a => a.name).join(', ')}</p>
                </div>
              </div>
            ))
          ) : (
            artists.map((artist, index) => (
              <div key={artist.id} className="card fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="rank">#{index + 1}</div>
                <img src={artist.images[0]?.url} alt={artist.name} />
                <div className="card-info">
                  <h3>{artist.name}</h3>
                  <p>{artist.genres.slice(0, 2).join(', ')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
