import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import "bootswatch/dist/simplex/bootstrap.min.css";
import Schedule from './schedule.jsx';
import Scores from './score.jsx';
import Stats from './stats.jsx';
import Standings from './standings.jsx';


function App() {
  return (
    <Router>
      <Navbar expand="lg" bg="success" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/nhlapp/#/">
            <img
              src="https://assets.nhle.com/logos/nhl/svg/NHL_light.svg"
              alt="NHL Logo"
              height="40"
              style={{ filter: 'invert(0)' }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/nhlapp/#/scores">Scores</Nav.Link>
              <Nav.Link href="/nhlapp/#/schedule">Schedule</Nav.Link>
              <Nav.Link href="/nhlapp/#/stats">Stats</Nav.Link>
              <Nav.Link href="/nhlapp/#/standings">Standings</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Scores />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/standings" element={<Standings />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;