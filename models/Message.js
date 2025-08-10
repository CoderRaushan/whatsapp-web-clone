
// Message Schema
const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  meta_msg_id: String,
  conversation_id: String,
  from: { type: String, required: true },
  to: String,
  text: String,
  type: { type: String, default: 'text' },
  timestamp: { type: Number, required: true },
  status: { type: String, default: 'sent' }, 
  contact_name: String,
  wa_id: String,
  is_outgoing: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema, 'processed_messages');

module.exports = Message;
