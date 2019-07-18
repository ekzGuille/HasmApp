const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'DATA 😊'
  });
});

module.exports = router;
