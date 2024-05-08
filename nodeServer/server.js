// Import dependencies
const startTime = Date.now();
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import logActivity from './Utils/LogActivies.js';

import nodemon from 'nodemon';

// Listen for the 'start' event
nodemon.on('start', () => {
  console.log('Server started');
  let report = 'nodemon: Server started'
  logActivity('serverLog',startTime, report )
});

// Listen for the 'quit' event
nodemon.on('quit', () => {
  console.log('nodemon: Server stopped');
  let report = 'nodemon: Server stopped'
  logActivity('serverLog',startTime, report )
});

// Listen for the 'restart' event
nodemon.on('restart', (files) => {
  console.log('nodemon: Server restarting due to changes:', files);
  let report = `nodemon: Server restarting due to changes:, ${files}`
  logActivity('serverLog',startTime, report )
});


// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception occurred:', err);
    process.exit(1);
});

// Environment variables
dotenv.config({ path: './config.env' });
const { NODE_ENV, DEV_HOST, PROD_HOST, HOSTED_CONN, LOCAL_CONN, PORT, NODE_SERVER_NAME } = process.env;
const HOST = NODE_ENV === 'development' ? DEV_HOST : PROD_HOST;
const URL = NODE_ENV === 'development' ? LOCAL_CONN : HOSTED_CONN;
const port = PORT || 7980;

// Database connection
mongoose.connect(URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
});



const connection = mongoose.connection;
connection.on('open', () => {
    console.log('Mongoose connected with mongoDB');
    let report = 'Sever restarted'
    logActivity('serverLog',startTime, report )
});
connection.on('error', (err) => {
    let report = 'Sever restart failed'
    logActivity('serverLog',startTime, report )
    console.error('MongoDB connection error:', err);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection occurred:', err);
    process.exit(1);
});

// Start the server
const server = app.listen(port, () => {
    // const address = server.address();
    console.log(`${NODE_SERVER_NAME} Server is running in ${NODE_ENV} mode on http://localhost:${port}`);
    console.log(`Client URL: http://${HOST}`);
    console.log('Waiting for database connection...');
});

// Gracefully handle shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        let report = 'SIGTERM received. Shutting down gracefully...'
        logActivity('serverLog',startTime, report )
        process.exit(0);
    });
});


// // CREATE A SERVER
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');


// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//     console.error('Uncaught Exception occurred:', err);
//     process.exit(1);
// });


// // Environment variables
// dotenv.config({ path: './config.env' });
// const { NODE_ENV, DEV_HOST, PROD_HOST, HOSTED_CONN, LOCAL_CONN, PORT, NODE_SERVER_NAME} = process.env;
// const HOST = NODE_ENV === 'development' ? DEV_HOST : PROD_HOST;
// const URL = NODE_ENV === 'development' ? LOCAL_CONN : HOSTED_CONN;
// const port = PORT || 7990;

// // Requiring app module
// const app = require('./app');

// // Database connection
// mongoose.connect(URL, {   
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//     // useFindAndModify: false,
//     // useCreateIndex: true
// });

// const connection = mongoose.connection;
// connection.on('open', () => {
//     console.log('Mongoose connected with mongoDB')
// })
// connection.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
// });

// // Handle unhandled rejections
// process.on('unhandledRejection', (err) => {
//     console.error('Unhandled Rejection occurred:', err);
//     process.exit(1);
// });

// // Start the server
// const server = app.listen(port, () => {
//     // const address = server.address();
//     console.log(`${NODE_SERVER_NAME} Server is running in ${NODE_ENV} mode on http://localhost:${port}`);
//     console.log(`Client URL: http://${HOST}`);
//     console.log('Waiting for database connection...');
// });

// // Gracefully handle shutdown
// process.on('SIGTERM', () => {
//     console.log('SIGTERM received. Shutting down gracefully...');
//     server.close(() => {
//         console.log('Server closed.');
//         process.exit(0);
//     });
// });
