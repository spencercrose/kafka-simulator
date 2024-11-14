import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'stream-simulator',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

// Producer (sending messages)
async function produce() {
  await producer.connect();
  await producer.send({
    topic: 'test-topic',
    messages: [{ value: 'Hello Kafka!' }],
  });
  console.log('Message sent');
}

// Consumer (receiving messages)
async function consume() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
    },
  });
}

// Run producer and consumer
produce();
consume();
