import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// often referred to as stan in documentation for the client
// connect(cluster_id, client_id, options)
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

// after connection
stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // graceful close event
  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  // use TicketCreatedListener
  new TicketCreatedListener(stan).listen();
});

// watch for interrupt or terminate signals and trigger close event
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
