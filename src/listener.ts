import nats, { Message, Stan } from 'node-nats-streaming';
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

  // graceful close event
  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  // set options for subscription
  // set manual acknowledgement mode to true - in case db is down for example
  // setDeliveryAllAvailable - sends all previously sent events - one approach to account for service downtime
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('test-service');
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

    msg.ack();
  });
});

// watch for interrupt or terminate signals and trigger close event
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

abstract class Listener {
  // abstract classes for subclasses to define
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void

  // asssumes instance of client has already successfully connected
  private client: Stan;
  protected ackWait = 5 * 1000; // 5000ms = 5s default ackWait

  constructor(client: Stan) {
    this.client = client;
  }

  // subscription options function
  // set manual acknowledgement mode to true - in case db is down for example
  // setDeliveryAllAvailable - sends all previously sent events - one approach to account for service downtime
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  // setup subscription
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} | ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    // parse string or buffer
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
