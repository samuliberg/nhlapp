import React from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import "bootswatch/dist/simplex/bootstrap.min.css";
import Schedule from './schedule.jsx';
import Scores from './score.jsx';
import Stats from './stats.jsx';
import Standings from './standings.jsx';


function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-success navbar-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
          <img
            src="https://assets.nhle.com/logos/nhl/svg/NHL_light.svg"
            alt="NHL Logo"
            height="40"
            style={{ filter: 'invert(0)' }} // Optional: makes it visible on dark background
          />
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/schedule">Schedule</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/scores">Scores</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/stats">Stats</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/standings">Standings</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Schedule />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/standings" element={<Standings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;