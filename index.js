//ahi va asta arriba del todo
// Vercel detects this root Express export as the application's Node function.
const express = require('express');
const servidor = require('./servidor/server');

const app = express();
app.use(servidor);

module.exports = app;
