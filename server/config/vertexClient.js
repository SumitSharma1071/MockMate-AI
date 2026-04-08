const { PredictionServiceClient } = require('@google-cloud/aiplatform');

const client = new PredictionServiceClient(); // Automatically uses GOOGLE_APPLICATION_CREDENTIALS

module.exports = client;