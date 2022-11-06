import nats from 'node-nats-streaming';

// often referred to as stan in documentation for the client
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// after connection
stan.on('connect', () => {
  console.log('Publisher connected to NATS');
});
