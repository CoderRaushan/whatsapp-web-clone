// processPayloads.js - Script to process sample webhook payloads
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

// Message Schema
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

// Contact Schema
const contactSchema = new mongoose.Schema({
  wa_id: { type: String, unique: true, required: true },
  name: String,
  last_message_time: Number,
  last_message: String
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema, 'processed_messages');
const Contact = mongoose.model('Contact', contactSchema);

// Process individual webhook payload
async function processWebhookPayload(payload) {
  try {
    if (!payload.metaData?.entry?.[0]?.changes?.[0]?.value) {
      console.log('Invalid payload structure');
      return null;
    }

    const value = payload.metaData.entry[0].changes[0].value;
    
    // Handle incoming messages
    if (value.messages) {
      for (const message of value.messages) {
        const contact = value.contacts?.[0];
        const contactName = contact?.profile?.name || 'Unknown';
        const waId = contact?.wa_id || message.from;
        
        console.log(`Processing message from ${contactName} (${waId})`);
        
        // Create or update contact
        await Contact.findOneAndUpdate(
          { wa_id: waId },
          {
            name: contactName,
            last_message_time: parseInt(message.timestamp),
            last_message: message.text?.body || message.type
          },
          { upsert: true, new: true }
        );

        // Check if message already exists
        const existingMessage = await Message.findOne({ id: message.id });
        if (existingMessage) {
          console.log(`Message ${message.id} already exists, skipping`);
          continue;
        }

        // Determine if message is outgoing
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
        console.log(`✅ Saved message: ${message.id}`);
      }
    }
    
    // Handle status updates
    if (value.statuses) {
      for (const status of value.statuses) {
        const updated = await Message.findOneAndUpdate(
          { $or: [{ id: status.id }, { meta_msg_id: status.meta_msg_id }] },
          { status: status.status },
          { new: true }
        );
        
        if (updated) {
          console.log(`✅ Updated message status: ${status.id} -> ${status.status}`);
        } else {
          console.log(`⚠️ Message not found for status update: ${status.id}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error processing payload:', error);
    throw error;
  }
}

// Process all JSON files in a directory
async function processDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`Found ${jsonFiles.length} JSON files to process`);
    
    for (const file of jsonFiles) {
      console.log(`\nProcessing ${file}...`);
      
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const payload = JSON.parse(fileContent);
      
      await processWebhookPayload(payload);
    }
    
    console.log('\n✅ All files processed successfully!');
  } catch (error) {
    console.error('❌ Error processing directory:', error);
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting WhatsApp Webhook Payload Processor');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Get directory path from command line arguments
    const dirPath = process.argv[2] || './sample_payloads';
    
    if (!fs.existsSync(dirPath)) {
      console.log(`❌ Directory ${dirPath} does not exist`);
      console.log('Usage: node processPayloads.js <directory_path>');
      process.exit(1);
    }
    
    console.log(`📂 Processing payloads from: ${dirPath}`);
    
    // Process all files in the directory
    await processDirectory(dirPath);
    
    // Display summary
    const messageCount = await Message.countDocuments();
    const contactCount = await Contact.countDocuments();
    
    console.log('\n📊 Summary:');
    console.log(`   Messages: ${messageCount}`);
    console.log(`   Contacts: ${contactCount}`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⏹️ Process interrupted');
  await mongoose.disconnect();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processWebhookPayload, processDirectory };