const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  wa_id: { type: String, unique: true, required: true },
  name: String,
  last_message_time: Number,
  last_message: String
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
