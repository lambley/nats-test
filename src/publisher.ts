import nats from 'node-nats-streaming';

console.clear();

// often referred to as stan in documentation for the client
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// after connection
stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  // convert test data object to JSON - NATS can only send strings
  const data = JSON.stringify({
    id: '000001',
    title: 'concert',
    price: 20,
  });

  // publish message to NATS
  // structure: publish(subject, data, callback after publish)
  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
