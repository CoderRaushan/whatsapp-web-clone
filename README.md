# WhatsApp Web Clone

A full-stack WhatsApp Web clone that processes WhatsApp Business API webhooks and displays real-time conversations with a UI that closely mimics the original WhatsApp Web interface.

## 🚀 Features

- **Real-time messaging** with Socket.IO
- **WhatsApp Web-like UI** with dark theme
- **Webhook processing** for WhatsApp Business API payloads
- **Message status tracking** (sent, delivered, read)
- **Responsive design** for mobile and desktop
- **Contact management** with profile information
- **Search functionality** for conversations
- **MongoDB storage** for messages and contacts

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Basic knowledge of JavaScript and Express.js

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd whatsapp-web-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Replace `<password>` and `<dbname>` in the connection string

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/whatsapp?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
```

### 5. Create the Frontend Directory

```bash
mkdir public
```

Copy the HTML file content to `public/index.html`

## 📊 Processing Sample Data

### Option 1: Using the Processing Script

1. Extract the sample payloads to a directory (e.g., `./sample_payloads/`)
2. Run the processor:

```bash
node processPayloads.js ./sample_payloads/
```

### Option 2: Using the API Endpoint

Send a POST request to `/api/process-sample-data` with the JSON payloads in the body.

## 🚀 Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Frontend + API)

1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri"
  }
}
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard

### Option 2: Render (Full Stack)

1. Create account on [Render](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables

### Option 3: Heroku

1. Install Heroku CLI
2. Create a new Heroku app:

```bash
heroku create your-app-name
```

3. Set environment variables:

```bash
heroku config:set MONGODB_URI=your_mongodb_connection_string
```

4. Deploy:

```bash
git push heroku main
```

### Option 4: Railway

1. Create account on [Railway](https://railway.app)
2. Connect GitHub repository
3. Deploy with one click
4. Set environment variables in dashboard

## 📱 API Endpoints

- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:waId/messages` - Get messages for a conversation
- `POST /api/send-message` - Send a new message (demo only)
- `POST /api/webhook` - Process webhook payloads
- `POST /api/process-sample-data` - Process sample data
- `GET /api/health` - Health check

## 🔧 Technical Architecture

### Backend
- **Express.js** - Web server framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database with Mongoose ODM
- **CORS** - Cross-origin resource sharing

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Socket.IO Client** - Real-time updates
- **CSS3** - Modern styling with flexbox and animations
- **Responsive Design** - Mobile-first approach

### Database Schema

#### Messages Collection
```javascript
{
  id: String (unique),
  meta_msg_id: String,
  from: String,
  to: String,
  text: String,
  type: String,
  timestamp: Number,
  status: String, // sent, delivered, read
  contact_name: String,
  wa_id: String,
  is_outgoing: Boolean,
  created_at: Date
}
```

#### Contacts Collection
```javascript
{
  wa_id: String (unique),
  name: String,
  last_message_time: Number,
  last_message: String
}
```

## 🎨 UI Features

- **Dark theme** matching WhatsApp Web
- **Message bubbles** with proper alignment
- **Status indicators** (✓ sent, ✓✓ delivered, ✓✓ read)
- **Contact avatars** with initials
- **Search functionality** for conversations
- **Real-time updates** without page refresh
- **Mobile responsive** design
- **Smooth animations** and transitions

## 🔄 Real-time Features

- New messages appear instantly
- Message status updates in real-time
- Connection status indicator
- Automatic conversation updates

## 📝 Usage Instructions

1. **View Conversations**: All conversations appear in the left sidebar
2. **Select Chat**: Click on any conversation to open it
3. **Send Messages**: Type in the input box and press Enter or click send
4. **Search**: Use the search box to find specific conversations
5. **Status Tracking**: See message delivery status with checkmarks

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your connection string
   - Verify network access in MongoDB Atlas
   - Ensure correct username/password

2. **Messages Not Appearing**
   - Check browser console for errors
   - Verify Socket.IO connection
   - Check MongoDB documents

3. **Mobile Layout Issues**
   - Clear browser cache
   - Check responsive CSS rules
   - Test on different devices

### Debug Mode

Set `NODE_ENV=development` to see detailed logs.

## 📈 Performance Considerations

- Messages are paginated (can be extended)
- Socket.IO rooms for efficient message delivery
- MongoDB indexes for fast queries
- Compressed assets for faster loading

## 🔐 Security Features

- CORS configuration
- Input sanitization
- MongoDB injection protection
- Environment variable protection

## 🚦 Testing

Test the webhook endpoint:

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d @sample_payload.json
```

## 📚 File Structure

```
whatsapp-web-clone/
├── server.js              # Main server file
├── processPayloads.js     # Webhook processor script
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── public/
│   └── index.html        # Frontend application
├── sample_payloads/      # Sample webhook data
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙋‍♂️ Support

For issues or questions:
- Check the troubleshooting section
- Review the GitHub issues
- Contact the development team

---

**Note**: This is a demo application. No real WhatsApp messages are sent. All functionality is for demonstration and development purposes only.