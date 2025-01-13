import express from 'express';
export const usersRouter = express.Router();

usersRouter.get('/', async function(req, res) {
  const users = await req.db.users.getAll();
  res.json(users);
});

usersRouter.post('/', async function(req, res) {
  try {
    const result = await req.db.users.create({
      email: req.body.email,
      name: req.body.name,
    });
    res.status(201).json(result);
  } catch (e) {
    if (e instanceof req.db.users.EmailConflictError) {
      res.status(409).end();
    }
    throw e;
  }
});