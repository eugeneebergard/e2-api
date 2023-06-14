const { NODE_ENV, DB_URL } = process.env;

module.exports = { url: NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/mydb' };
