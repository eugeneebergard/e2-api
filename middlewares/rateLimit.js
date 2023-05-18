const rateLimit = require('express-rate-limit');

const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 часа в миллисекундах
  max: 100,
  message: 'Лимит запросов превышен!',
  headers: true,
});

module.exports = rateLimiterUsingThirdParty;
