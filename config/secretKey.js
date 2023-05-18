const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = { key: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret' };
