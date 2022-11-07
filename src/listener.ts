import nats, { Message } from 'node-nats-streaming';

console.clear();

// often referred to as stan in documentation for the client
const stan = nats.connect('ticketing', '123', {
  url: 'http://localhost:4222',
});

// after connection
stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // object to listen for
  const subscription = stan.subscribe('ticket:created');

  // on message (event) being emitted
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    // check data is string
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
  });
});
