const Contact = require('../models/Contact');
const Message = require('../models/Message');

exports.getAllConversations = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ last_message_time: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesByConversation = async (req, res) => {
  try {
    const { waId } = req.params;
    const messages = await Message.find({
      $or: [
        { wa_id: waId },
        { from: waId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
