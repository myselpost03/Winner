import { db } from "../connect.js";


//! Get searched username
export const searchUsernames = (req, res) => {
  
  const { searchQuery } = req.body;

  const q = `SELECT username from users WHERE username LIKE '%${searchQuery}%'`;

  db.query(q, (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: "An error occurred while searching usernames." });
    } else {
      const usernames = results.map((row) => [row.username]);
      res.json({ usernames });
    }
  });
};

//! Get username suggestions
export const getUsernameSuggestions = (req, res) => {
  const { searchQuery } = req.body;

  const q = `
      SELECT username, id FROM users
      WHERE username LIKE '%${searchQuery}%'
      LIMIT 15
    `;

  db.query(q, (error, results) => {
    if (error) {
      console.error("Error getting suggestions:", error);
      res
        .status(500)
        .json({ error: "An error occurred while getting suggestions." });
    } else {
      const suggestions = results.map((row) => [row.username, row.id]);
      res.json({ suggestions });
    }
  });
};
