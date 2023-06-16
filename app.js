require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const { url, port, mongooseOptions, corsOptions } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { serverError } = require('./errors/serverError');
const routes = require('./routes');

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

void mongoose.connect(url, mongooseOptions);

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(serverError);

app.listen(port, () => {
  console.log(`Ссылка на сервер: localhost:${port}`);
});
