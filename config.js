const { NODE_ENV, JWT_SECRET, DB_URL } = process.env;

module.exports = {
  url: NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/mydb',
  key: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  port: process.env.PORT || 3000,
  mongooseOptions: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  corsOptions: {
    origin: ['http://localhost:8080'],
    credentials: true,
  }
}
