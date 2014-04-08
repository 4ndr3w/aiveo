/**
 * alertbox
*/
module.exports = function(req, res, next) {

  res.locals.alertbox = undefined;
  return next();
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
//  return res.forbidden('You are not permitted to perform this action.');
};
