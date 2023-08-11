import { db } from "../connect.js";

//! Get selfie of the day
export const getSod = (req, res) => {
  const q = `SELECT s.img
    FROM selposts AS s
    INNER JOIN fires AS f ON s.id = f.selpostId
    GROUP BY s.img
    ORDER BY COUNT(*) DESC
    LIMIT 1
    `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//! Get losers of the day
export const getLoser = (req, res) => {
  const q = `
    SELECT s.img
    FROM selposts AS s
    INNER JOIN fires AS f ON s.id = f.selpostId
    GROUP BY s.img
    ORDER BY COUNT(*) ASC
    LIMIT 1
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
