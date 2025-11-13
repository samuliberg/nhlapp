import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import "bootswatch/dist/simplex/bootstrap.min.css";

function LiveScores() {
  const [liveGames, setLiveGames] = useState([]);
  const [finishedGames, setFinishedGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE;

  const pvm = new Date();
  const formattedDate = `${pvm.getFullYear()}-${String(
    pvm.getMonth() + 1
  ).padStart(2, "0")}-${String(pvm.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const now = new Date();
        const twelvehHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        
        // Fetch today's games
        const res = await fetch(`${API_BASE}/score/${formattedDate}`);
        const data = await res.json();
        
        // Also fetch yesterday's games to catch recent games
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayFormatted = `${yesterday.getFullYear()}-${String(
          yesterday.getMonth() + 1
        ).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
        
        const yesterdayRes = await fetch(`${API_BASE}/score/${yesterdayFormatted}`);
        const yesterdayData = await yesterdayRes.json();
        
        // Combine all games
        const allGames = [...data.games, ...yesterdayData.games];
        
        const live = allGames.filter((game) => game.gameState === "LIVE" || game.gameState === "CRIT");
        const todayFinished = data.games.filter((game) => game.gameState === "OFF" || game.gameState === "FINAL");
        
        // Filter games that ended within last 12 hours
        const recent = allGames.filter((game) => {
          if (game.gameState !== "OFF" || !game.endTimeUTC) return false;
          
          const gameEndTime = new Date(game.endTimeUTC);
          return gameEndTime > twelvehHoursAgo && gameEndTime <= now;
        });
        
        setLiveGames(live);
        setFinishedGames(todayFinished);
        setRecentGames(recent.filter(game => !todayFinished.some(tf => tf.id === game.id))); // Remove duplicates
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error fetching scores:", err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchGames();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchGames, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [API_BASE, formattedDate]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading scores...</p>
      </div>
    );

  // Function to calculate cumulative game time
  const calculateGameTime = (period, timeInPeriod) => {
    if (!period || !timeInPeriod) return timeInPeriod || '';
    
    // Parse time in period (format: "MM:SS")
    const [minutes, seconds] = timeInPeriod.split(':').map(Number);
    
    // Calculate total minutes elapsed
    let totalMinutes = (period - 1) * 20 + minutes; // Each period is 20 minutes
    
    // Format as MM:SS
    const totalMinutesFormatted = Math.floor(totalMinutes);
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    return `${totalMinutesFormatted}:${formattedSeconds}`;
  };

  const renderGameCard = (game, index, isLive = false, isRecent = false) => {
    const homeAbbrev = game.homeTeam.abbrev;
    const awayAbbrev = game.awayTeam.abbrev;

    const homeGoals =
      game.goals?.filter((g) => g.teamAbbrev === homeAbbrev) || [];
    const awayGoals =
      game.goals?.filter((g) => g.teamAbbrev === awayAbbrev) || [];

    return (
      <Col
        key={index}
        xs={12}
        md={12}
        lg={11}
        xl={10}
        className="d-flex justify-content-center mb-4"
      >
        <a
          href={`https://www.nhl.com${game.gameCenterLink}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          <Card
            className="shadow-sm w-100"
            style={{
              borderRadius: "18px",
              padding: isLive ? "0" : "1.75rem",
              minHeight: "340px",
              maxWidth: "1100px",
              margin: "0 auto",
              border: isLive ? "2px solid #dc3545" : "1px solid #dee2e6",
            }}
          >
            {isLive && (
              <Card.Header className="bg-danger text-white text-center py-2" style={{ borderRadius: "16px 16px 0 0" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-light text-danger fw-bold">LIVE</span>
                  <div>
                    {game.clock?.inIntermission ? (
                      <span className="fw-bold text-warning">
                        Intermission {game.clock?.timeRemaining && `- ${game.clock.timeRemaining}`}
                      </span>
                    ) : (
                      <>
                        {game.clock?.timeRemaining && (
                          <span className="me-3 fw-bold">{game.clock.timeRemaining}</span>
                        )}
                        {game.period && (
                          <span className="fw-bold">Period {game.period}</span>
                        )}
                      </>
                    )}
                  </div>
                  <small className="opacity-75">
                    {lastUpdated?.toLocaleTimeString()}
                  </small>
                </div>
              </Card.Header>
            )}
            {isRecent && (
              <Card.Header className="bg-secondary text-white text-center py-2" style={{ borderRadius: "16px 16px 0 0" }}>
                <div className="d-flex justify-content-center align-items-center">
                  <span className="badge bg-light text-secondary fw-bold">FINAL</span>
                </div>
              </Card.Header>
            )}
            <Card.Body className="text-center" style={{ padding: isLive ? "1.75rem" : "inherit" }}>
              <Row className="align-items-start">
                {/* HOME TEAM COLUMN */}
                <Col
                  xs={12}
                  md={6}
                  className="d-flex flex-column align-items-center border-end"
                >
                  <img
                    src={game.homeTeam.logo}
                    alt={game.homeTeam.name.default}
                    style={{ height: "60px" }}
                  />
                  <div className="fs-2 fw-bold mt-2">{game.homeTeam.score}</div>
                  <div className="text-muted mb-3">
                    SOG: {game.homeTeam.sog}
                    {game.situationCode === "0651" && game.homeTeam.pullGoalie && (
                      <span className="badge bg-warning text-dark ms-2 small">Empty Net</span>
                    )}
                  </div>

                  {/* HOME GOALS */}
                  <div className="w-100 text-start ps-3">
                    {homeGoals.length > 0 ? (
                      homeGoals.map((goal, i) => (
                        <div key={i} className="small mb-2 d-flex align-items-start">
                          <img
                            src={goal.mugshot}
                            alt={goal.name.default}
                            style={{
                              height: "30px",
                              width: "30px",
                              borderRadius: "50%",
                              marginRight: "8px",
                            }}
                          />
                          <div>
                            <div>
                              {goal.homeScore !== undefined && goal.awayScore !== undefined && (
                                <span className="badge bg-success text-white me-2 small">
                                  {goal.homeScore}-{goal.awayScore}
                                </span>
                              )}
                              <strong>{goal.name.default}</strong>{" "}
                              <span className="text-muted small">({calculateGameTime(goal.period, goal.timeInPeriod)})</span>
                            </div>
                            {goal.assists?.length > 0 && (
                              <div className="text-muted small">
                                A: {goal.assists.map((a) => a.name.default).join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted small text-center">No goals</div>
                    )}
                  </div>
                </Col>

                {/* AWAY TEAM COLUMN */}
                <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                  <img
                    src={game.awayTeam.logo}
                    alt={game.awayTeam.name.default}
                    style={{ height: "60px" }}
                  />
                  <div className="fs-2 fw-bold mt-2">{game.awayTeam.score}</div>
                  <div className="text-muted mb-3">
                    SOG: {game.awayTeam.sog}
                    {game.situationCode === "0651" && game.awayTeam.pullGoalie && (
                      <span className="badge bg-warning text-dark ms-2 small">Empty Net</span>
                    )}
                  </div>

                  {/* AWAY GOALS */}
                  <div className="w-100 text-start ps-3">
                    {awayGoals.length > 0 ? (
                      awayGoals.map((goal, i) => (
                        <div key={i} className="small mb-2 d-flex align-items-start">
                          <img
                            src={goal.mugshot}
                            alt={goal.name.default}
                            style={{
                              height: "30px",
                              width: "30px",
                              borderRadius: "50%",
                              marginRight: "8px",
                            }}
                          />
                          <div>
                            <div>
                              {goal.homeScore !== undefined && goal.awayScore !== undefined && (
                                <span className="badge bg-success text-white me-2 small">
                                  {goal.homeScore}-{goal.awayScore}
                                </span>
                              )}
                              <strong>{goal.name.default}</strong>{" "}
                              <span className="text-muted small">({calculateGameTime(goal.period, goal.timeInPeriod)})</span>
                            </div>
                            {goal.assists?.length > 0 && (
                              <div className="text-muted small">
                                A: {goal.assists.map((a) => a.name.default).join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted small text-center">No goals</div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </a>
      </Col>
    );
  };

  return (
    <div className="container-fluid min-vh-100 justify-content-center align-items-center mt-4">
      {/* LIVE GAMES SECTION */}
      {liveGames.length > 0 && (
        <>
          <h2 className="text-center mb-4">Live Games</h2>
          <Row className="justify-content-center">
            {liveGames.map((game, index) => renderGameCard(game, `live-${index}`, true))}
          </Row>
        </>
      )}

      {/* RECENT GAMES SECTION (Last 12 hours) */}
      {recentGames.length > 0 && (
        <>
          <h3 className="text-center mb-4 mt-5">Recently Finished (Last 12 Hours)</h3>
          <Row className="justify-content-center">
            {recentGames.map((game, index) => renderGameCard(game, `recent-${index}`, false, true))}
          </Row>
        </>
      )}

      {/* FINISHED GAMES SECTION */}
      {finishedGames.length > 0 && (
        <>
          <h3 className="text-center mb-4 mt-5">Today's Final Scores</h3>
          <Row className="justify-content-center">
            {finishedGames.map((game, index) => renderGameCard(game, `finished-${index}`, false))}
          </Row>
        </>
      )}

      {/* NO GAMES MESSAGE */}
      {liveGames.length === 0 && finishedGames.length === 0 && recentGames.length === 0 && (
        <div className="text-center mt-5">
          <p>No games available.</p>
        </div>
      )}
    </div>
  );
}

export default LiveScores;
