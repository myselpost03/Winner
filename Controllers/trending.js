import { db } from "../connect.js";

//! Get trendings
export const getTrendings = (req, res) => {
  const q = `SELECT s.category, s.img
  FROM selposts AS s
  INNER JOIN fires AS f ON s.id = f.selpostId
  GROUP BY s.category, s.img
  ORDER BY COUNT(*) DESC
  LIMIT 8
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


