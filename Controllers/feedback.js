import { db } from "../connect.js";

//! Save feedback
export const addFeedback = (req, res) => {
  const q = "INSERT INTO feedback (`name`, `email`, `message`) VALUES (?)";

  const values = [req.body.name, req.body.email, req.body.message];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("feedback has been sent!");
  });
};
