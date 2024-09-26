const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

// Setup VAPID keys
webPush.setVapidDetails(
  'mailto:ezequielamin@outlook.com',
  publicVapidKey,
  privateVapidKey
);

// In-memory storage for subscriptions
const subscriptions = [];

// Route to subscribe the user
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);

  res.status(201).json({});
  console.log('Subscription added:', subscription);
});

// Route to send notifications to all subscribed users
app.post('/sendNotification', (req, res) => {
  const payload = JSON.stringify({
    title: 'Push Test',
    body: 'This is a push notification to all users!',
    icon: '/icon.png',
  });

  subscriptions.forEach((subscription) => {
    webPush.sendNotification(subscription, payload).catch((error) => {
      console.error('Error sending notification:', error);
    });
  });

  res.status(200).json({ message: 'Notifications sent' });
});

// Load SSL certificate
// const sslOptions = {
//   key: fs.readFileSync('./certificates/server.key'),
//   cert: fs.readFileSync('./certificates/server.cert'),
// };

// // Start the server with HTTPS
// https.createServer(sslOptions, app).listen(5000, () => {
//   console.log('Server is running on https://localhost:5000');
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
