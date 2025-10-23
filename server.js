import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all routes

app.get('/api/schedule/now', async (req, res) => {
  try {
    const response = await fetch('https://api-web.nhle.com/v1/schedule/now');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Schedule data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.get('/api/score/now', async (req, res) => {
  try {
    const response = await fetch('https://api-web.nhle.com/v1/score/now');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Score data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.get('/api/stats', async (req, res) => {
  try {
    const response = await fetch('https://api-web.nhle.com/v1/skater-stats-leaders/current');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Stats data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.get('/api/standings', async (req, res) => {
  try {
    const response = await fetch('https://api-web.nhle.com/v1/standings/now');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Standings data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});






app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

