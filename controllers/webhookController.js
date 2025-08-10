const processWebhookPayload = require('../utils/processWebhook');

exports.handleWebhook = async (req, res, io) => {
  try {
    await processWebhookPayload(req.body, io);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.processSampleData = async (req, res, io) => {
  try {
    const sampleData = req.body;
    if (Array.isArray(sampleData)) {
      for (const payload of sampleData) {
        await processWebhookPayload(payload, io);
      }
    } else {
      await processWebhookPayload(sampleData, io);
    }
    res.json({ success: true, message: 'Sample data processed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
