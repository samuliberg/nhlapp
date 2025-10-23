import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import "bootswatch/dist/simplex/bootstrap.min.css";

function Scores() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const pvm = new Date();
  pvm.setDate(pvm.getDate() - 1); // 👈 Move one day back

  useEffect(() => {
    fetch('v1/score/'+pvm.getFullYear()+'-'+String(pvm.getMonth()+1).padStart(2, '0')+'-'+String(pvm.getDate()).padStart(2, '0')) // Replace with your actual API
      .then(res => res.json())
      .then(data => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const helsinkiYesterday = new Date(yesterday.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }));
        const targetDateStr = helsinkiYesterday.toISOString().split('T')[0];

        const completedGames = data.games.filter(game =>
          game.gameDate === targetDateStr && game.gameState === 'OFF'
        );

        setGames(completedGames);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching last night scores:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>;

return (
  <div className="container-fluid min-vh-100 justify-content-center mt-2">
    {/* <div className="container d-flex flex-column align-items-center min-vh-100 mt-5"> */}
    <h2 className="text-center mb-4">Last Night's Scores</h2>
    <Row className="justify-content-center">
      {games.map((game, index) => (

<Col key={index} xs={12} sm={8} md={6} lg={4} xl={3} className="d-flex justify-content-center mb-4">
  <a
    href={`https://www.nhl.com${game.gameCenterLink}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <Card className="shadow-sm w-100 my-1" style={{ maxWidth: '300px', borderRadius: '15px', margin: '30px'}}>
      <Card.Body className="d-flex flex-column align-items-center text-center my-2">
        <div className="d-flex justify-content-around align-items-center w-100 mb-3">
          <div className="d-flex flex-column align-items-center">
            <img src={game.homeTeam.logo} alt={game.homeTeam.name.default} style={{ height: '40px' }} />
            <div className="fs-4 fw-bold mt-2">{game.homeTeam.score}</div>
            <div className="text-muted mt-1">SOG: {game.homeTeam.sog}</div>
          </div>
          <div className="fw-bold fs-6 mx-2">vs</div>
          <div className="d-flex flex-column align-items-center">
            <img src={game.awayTeam.logo} alt={game.awayTeam.name.default} style={{ height: '40px' }} />
            <div className="fs-4 fw-bold mt-2">{game.awayTeam.score}</div>
            <div className="text-muted mt-1">SOG: {game.awayTeam.sog}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  </a>
</Col>

      ))}
    </Row>
  </div>
);

}
export default Scores;