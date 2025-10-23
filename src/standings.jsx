import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Standings = () => {
  const [eastern, setEastern] = useState([]);
  const [western, setWestern] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/standings')
      .then(response => response.json())
      .then(data => {
        const east = data.standings.filter(team => team.conferenceAbbrev === 'E');
        const west = data.standings.filter(team => team.conferenceAbbrev === 'W');
        setEastern(east);
        setWestern(west);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching NHL standings:', error);
        setLoading(false);
      });
  }, []);

  const renderTable = (teams, title) => (
    <div className="col-xs-12 col-sm-6col-lg-3 mb-4">
      <h4 className="mb-3">{title}</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{ minWidth: '200px' }}>Team</th>
              <th>Division</th>
              <th>GP</th>
              <th>W</th>
              <th>L</th>
              <th>OT</th>
              <th>PTS</th>
              <th>GD</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <img
                    src={team.teamLogo}
                    alt={team.teamAbbrev.default}
                    style={{ width: '30px', marginRight: '10px' }}
                  />
                  {team.teamName.default}
                </td>
                <td>{team.divisionName}</td>
                <td>{team.gamesPlayed}</td>
                <td>{team.wins}</td>
                <td>{team.losses}</td>
                <td>{team.otLosses}</td>
                <td>{team.points}</td>
                <td>{team.goalDifferential}</td>
                <td>{team.streakCode}{team.streakCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">NHL Standings</h2>
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading table...</p>
        </div>
      ) : (
        <div className="row gx-5">
          {renderTable(eastern, 'Eastern Conference')}
          {renderTable(western, 'Western Conference')}
        </div>
      )}
    </div>
  );
};

export default Standings;
``