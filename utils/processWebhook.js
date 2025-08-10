const Message = require('../models/Message');
const Contact = require('../models/Contact');

async function processWebhookPayload(payload, io) {
  try {
    if (!payload.metaData?.entry?.[0]?.changes?.[0]?.value) {
      return null;
    }

    const value = payload.metaData.entry[0].changes[0].value;

    if (value.messages) {
      for (const message of value.messages) {
        const contact = value.contacts?.[0];
        const contactName = contact?.profile?.name || 'Unknown';
        const waId = contact?.wa_id || message.from;

        await Contact.findOneAndUpdate(
          { wa_id: waId },
          {
            name: contactName,
            last_message_time: parseInt(message.timestamp),
            last_message: message.text?.body || message.type
          },
          { upsert: true, new: true }
        );

        const existingMessage = await Message.findOne({ id: message.id });
        if (existingMessage) continue;

        const isOutgoing = message.from === value.metadata?.display_phone_number;

        const messageDoc = new Message({
          id: message.id,
          meta_msg_id: message.id,
          from: message.from,
          to: isOutgoing ? waId : value.metadata?.display_phone_number,
          text: message.text?.body || '',
          type: message.type || 'text',
          timestamp: parseInt(message.timestamp),
          status: 'sent',
          contact_name: contactName,
          wa_id: waId,
          is_outgoing: isOutgoing
        });

        const savedMessage = await messageDoc.save();
        io.emit('new_message', savedMessage);
      }
    }

    if (value.statuses) {
      for (const status of value.statuses) {
        const updated = await Message.findOneAndUpdate(
          { $or: [{ id: status.id }, { meta_msg_id: status.meta_msg_id }] },
          { status: status.status },
          { new: true }
        );

        if (updated) {
          io.emit('message_status_update', {
            messageId: status.id,
            meta_msg_id: status.meta_msg_id, 
            status: status.status
          });
        }
      }
    }
  } catch (err) {
    console.error('Error processing payload:', err);
    throw err;
  }
}

module.exports = processWebhookPayload;
