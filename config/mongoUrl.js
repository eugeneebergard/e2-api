const { NODE_ENV, DB_URL } = process.env;

/** TODO: Добавить DB_URL */
module.exports = { url: NODE_ENV === 'production' ? DB_URL : '/' };
