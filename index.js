//vercel 
const express = require('express');
const servidor = require('./servidor/server');

const app = express();
app.use(servidor);

module.exports = app;
