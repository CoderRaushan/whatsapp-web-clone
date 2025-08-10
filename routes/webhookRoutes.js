const express = require('express');
const router = express.Router();
const { handleWebhook, processSampleData } = require('../controllers/webhookController');

module.exports = (io) => {
  router.post('/webhook', (req, res) => handleWebhook(req, res, io));
  router.post('/process-sample-data', (req, res) => processSampleData(req, res, io));
  return router;
};
