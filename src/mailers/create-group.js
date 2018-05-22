module.exports = function sendGroupEmail(ctx, user) {
  return ctx.sendMail('new-group', { to: user.email, subject: 'You create a new group' }, { user });
};
