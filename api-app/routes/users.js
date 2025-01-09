var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  const users = req.db.users.getAll.all();
  res.json(users);
});

router.post('/', function(req, res) {
  const result = req.db.users.insert.run(req.body.email);
  res.json(result);
});

module.exports = router;
