import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// often referred to as stan in documentation for the client
// connect(cluster_id, client_id, options)
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

// after connection
stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // set options for subscription
  // set manual acknowledgement mode to true - in case db is down for example
  const options = stan.subscriptionOptions().setManualAckMode(true);

  // object to listen for
  // subscribe(channel, queueGroup)
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );

  // on message (event) being emitted
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    // check data is string
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
  });
});
