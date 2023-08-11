import { db } from "../connect.js";

//! Get suggested users
export const getSuggestions = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT username, id FROM users ORDER BY RAND()
  LIMIT 6`;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
