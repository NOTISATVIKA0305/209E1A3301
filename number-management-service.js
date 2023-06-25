const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  const urls = Array.isArray(req.query.url) ? req.query.url : [req.query.url];

  if (!urls.length) {
    return res.status(400).json({ error: 'Invalid query parameter: url' });
  }

  const requests = urls.map(url =>
    axios.get(url, { timeout: 500 })
      .then(response => response.data.numbers)
      .catch(error => {
        console.error(`Error fetching ${url}:`, error.message);
        return [];
      })
  );

  try {
    const responses = await Promise.all(requests);
    const mergedNumbers = Array.from(new Set(responses.flat()));
    const sortedNumbers = mergedNumbers.sort((a, b) => a - b);
    res.json({ numbers: sortedNumbers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});