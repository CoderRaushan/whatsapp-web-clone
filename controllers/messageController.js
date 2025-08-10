const Message = require('../models/Message');
const Contact = require('../models/Contact');

exports.sendMessage = async (req, res, io) => {
  try {
    const { to, text, from } = req.body;
    if (!to || !text) {
      return res.status(400).json({ error: 'Missing required fields: to, text' });
    }

    let contact = await Contact.findOne({ wa_id: to });
    if (!contact) {
      contact = new Contact({
        wa_id: to,
        name: `User ${to}`,
        last_message_time: Date.now(),
        last_message: text
      });
      await contact.save();
    }

    const message = new Message({
      id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      meta_msg_id: `demo_${Date.now()}`,
      from: from || '918329446654',
      to: to,
      text: text,
      type: 'text',
      timestamp: Math.floor(Date.now() / 1000),
      status: 'sent',
      contact_name: contact.name,
      wa_id: to,
      is_outgoing: true
    });

    const savedMessage = await message.save();
    contact.last_message_time = savedMessage.timestamp;
    contact.last_message = text;
    await contact.save();

    io.emit('new_message', savedMessage);
    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
