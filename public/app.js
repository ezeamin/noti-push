// app.js

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;

if ('serviceWorker' in navigator) {
  subscribeUser();
}

async function subscribeUser() {
  const register = await navigator.serviceWorker.register(
    '/service-worker.js',
    {
      scope: '/',
    }
  );

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  console.log('User is subscribed:', subscription);

  // Send the subscription object to your server
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

document.getElementById('send-button').addEventListener('click', subscribeUser);
