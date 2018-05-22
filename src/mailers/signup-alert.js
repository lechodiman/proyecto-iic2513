module.exports = function sendWelcomeEmail(ctx, { user }) {
  return ctx.sendMail('signup', { to: user.email, subject: 'Welcome!' }, { user });
};
