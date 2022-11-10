import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

// often referred to as stan in documentation for the client
// connect(cluster_id, client_id, options)
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// after connection
stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '000001',
      title: 'concert',
      price: 20,
    });
  } catch (error) {
    console.log(error);
  }
});
