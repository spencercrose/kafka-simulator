/**
 * @file index.js
 * @description Express server for Kafka Simulator
 */

import express from 'express';
import { Kafka } from 'kafkajs';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

// Set up Kafka
const kafka = new Kafka({
  clientId: 'kafka-simulator-app',
  brokers: [process.env.KAFKA_BROKER],
});

// Allow CORS requests from the specified KAFKA_BROKER
const corsOptions = {
  origin: [process.env.KAFKA_BROKER],
};

app.use(cors(corsOptions));

// Set up Helmet for security
app.use(helmet());

// Set up Morgan for logging
const loggingFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(morgan(loggingFormat));

// Middleware to parse JSON payload
app.use(express.json());

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

// Set up Express
const app = express();
const port = 4000;

// Start Kafka producer
async function startProducer() {
  await producer.connect();
  console.log('Producer connected');
}

// Start Kafka consumer
async function startConsumer() {
  await consumer.connect();
  console.log('Consumer connected');
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Consumed message: ${message.value.toString()}`);
    },
  });
}

// Express Route to send a message (Producer)
app.get('/produce', async (req, res) => {
  const message = 'Hello, Kafka from Express!';
  
  try {
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: message }],
    });
    res.send('Message sent to Kafka!');
  } catch (err) {
    console.error('Error producing message', err);
    res.status(500).send('Failed to send message to Kafka');
  }
});

// API endpoint to check status of server
app.get('/health', async (req, res) => {
  res.status(200).send({ status: 'OK' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send({ error: 'Not Found' });
});

// Start Express app
app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
  startProducer();
  startConsumer();
});

