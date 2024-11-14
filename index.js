/**
 * @file index.js
 * @description Express server for Kafka Simulator
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

const app = express();
const port = 4000;

// Allow CORS requests from the specified CLIENT_HOST
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

// API endpoint to send text to OpenAI
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});