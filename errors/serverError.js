module.exports.serverError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Внутренняя ошибка сервера' : message,
  });
  next();
};
