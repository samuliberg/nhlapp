import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Form } from 'react-bootstrap';
import "bootswatch/dist/simplex/bootstrap.min.css";

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('goals');
  const [playerSearch, setPlayerSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const categories = {
    goals: 'Goals',
    assists: 'Assists',
    points: 'Points',
    plusMinus: 'Plus/Minus',
    penaltyMins: 'Penalty Minutes',
    faceoffLeaders: 'Faceoff Win %',
    goalsPp: 'Power Play Goals',
    goalsSh: 'Shorthanded Goals',
    toi: 'Time on Ice (sec)'
  };

  useEffect(() => {
    fetch('http://localhost:3000/api/stats') // Replace with your actual API
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching NHL stats:', err);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handlePlayerSearchChange = (e) => setPlayerSearch(e.target.value.toLowerCase());
  const handleTeamChange = (e) => setSelectedTeam(e.target.value);

  const getFilteredPlayers = () => {
    if (!stats || !stats[selectedCategory]) return [];

    return stats[selectedCategory].filter(player => {
      const fullName = `${player.firstName.default} ${player.lastName.default}`.toLowerCase();
      const matchesName = fullName.includes(playerSearch);
      const matchesTeam = selectedTeam === 'all' || player.teamAbbrev === selectedTeam;
      return matchesName && matchesTeam;
    });
  };

  const getTeamOptions = () => {
    const teams = new Set();
    if (stats) {
      Object.values(stats).flat().forEach(player => {
        teams.add(player.teamAbbrev);
      });
    }
    return Array.from(teams).sort();
  };

  return (
    <Container>
      <h1 className="my-4">NHL Stats Summary</h1>

      <Form className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group controlId="statCategorySelect">
              <Form.Label>Stat Category</Form.Label>
              <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="playerSearch">
              <Form.Label>Search Player</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter player name"
                value={playerSearch}
                onChange={handlePlayerSearchChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="teamFilter">
              <Form.Label>Filter by Team</Form.Label>
              <Form.Select value={selectedTeam} onChange={handleTeamChange}>
                <option value="all">All Teams</option>
                {getTeamOptions().map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading stats...</p>
        </div>
      ) : (
        <>
          <h3>{categories[selectedCategory]}</h3>
          <Row>
            {getFilteredPlayers().map(player => (
              <Col key={player.id} md={4} lg={3} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={player.headshot} />
                  <Card.Body>
                    <Card.Title>{player.firstName.default} {player.lastName.default}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {player.teamName.default} ({player.teamAbbrev})
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Position:</strong> {player.position}<br />
                      <strong>{categories[selectedCategory]}:</strong> {player.value}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default Stats;