import express from 'express';
export const usersRouter = express.Router();

usersRouter.get('/', function(req, res) {
  const users = req.db.users.getAll.all();
  res.json(users);
});

usersRouter.post('/', function(req, res) {
  const result = req.db.users.insert.run(req.body.email);
  res.json(result);
});