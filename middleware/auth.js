module.exports = function requireAuth(req, res, next) {
  if (!req.session.admin) {
    req.session.error = 'Please login to continue.';
    return res.redirect('/');
  }
  next();
};
