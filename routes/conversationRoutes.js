const express = require('express');
const router = express.Router();
const { getAllConversations, getMessagesByConversation } = require('../controllers/conversationController');

router.get('/', getAllConversations);
router.get('/:waId/messages', getMessagesByConversation);

module.exports = router;
