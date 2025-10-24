import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import "bootswatch/dist/simplex/bootstrap.min.css";

function Schedule() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const pvm = new Date();
  const API_BASE = import.meta.env.VITE_API_BASE;


  useEffect(() => {
    fetch(`${API_BASE}/schedule/${pvm.getFullYear()}-${String(pvm.getMonth() + 1).padStart(2, '0')}-${String(pvm.getDate()).padStart(2, '0')}`)
    // fetch('http://localhost:3000/api/schedule/now')
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const helsinkiNow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }));
        const endOfTomorrow = new Date(helsinkiNow);
        endOfTomorrow.setDate(helsinkiNow.getDate() + 1);
        endOfTomorrow.setHours(23, 59, 59, 999);

        const filteredGames = data.gameWeek.flatMap(day =>
          day.games
            .filter(game => {
              const localTimeStr = new Date(game.startTimeUTC).toLocaleString('en-US', {
                timeZone: 'Europe/Helsinki'
              });
              const gameTime = new Date(localTimeStr);
              return gameTime >= helsinkiNow && gameTime <= endOfTomorrow;
            })
            .map(game => {
              const localTimeStr = new Date(game.startTimeUTC).toLocaleString('en-US', {
                timeZone: 'Europe/Helsinki'
              });
              return {
                time: localTimeStr,
                home: game.homeTeam.placeName.default + ' ' + game.homeTeam.commonName.default,
                away: game.awayTeam.placeName.default + ' ' + game.awayTeam.commonName.default,
                homeLogo: game.homeTeam.logo,
                awayLogo: game.awayTeam.logo,
                ticketsLink: game.ticketsLink
              };
            })
        );

        setGames(filteredGames);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching schedule:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="text-center">
      <Spinner animation="border" />
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="container-fluid justify-content-center align-items-start min-vh-100 mt-2">
      <h2 className="text-center mb-4">Tomorrow's Games</h2>
      <div className="w-100" style={{ maxWidth: '100%' }}>
        <Row className="justify-content-start align-items-start">
          {games.map((game, index) => (
            <Col key={index} xs={12} sm={10} md={8} lg={6} xl={4} className="d-flex justify-content-center mb-4">
              <Card className="shadow-sm w-100" style={{ maxWidth: '250px' }}>
                <Card.Header className="text-center fw-bold">{game.time}</Card.Header>
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <img src={game.homeLogo} alt={game.home} style={{ height: '40px', marginRight: '8px' }} />
                    <span className="fw-semibold">{game.home}</span>
                  </div>
                  <div className="mb-2">vs</div>
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <img src={game.awayLogo} alt={game.away} style={{ height: '40px', marginRight: '8px' }} />
                    <span className="fw-semibold">{game.away}</span>
                  </div>
                  <div>
                    <a href={game.ticketsLink} target="_blank" rel="noopener noreferrer" className="text-success fw-semibold">
                      Buy tickets
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Schedule;