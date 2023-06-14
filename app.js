require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const { url } = require('./config/mongoUrl');
const corsOptions = require('./config/corsOptions');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { serverError } = require('./errors/serverError');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

void mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use(serverError);

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: localhost:${PORT}`);
});
