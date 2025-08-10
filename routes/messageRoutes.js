const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/messageController');

module.exports = (io) => {
  router.post('/send-message', (req, res) => sendMessage(req, res, io));
  return router;
};
