const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('session.new', '/new', async ctx =>
  ctx.render('session/new', {
    createSessionPath: ctx.router.url('session.create'),
    notice: ctx.flashMessage.notice,
  }));

router.put('session.create', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.find({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    ctx.session.userId = user.id;
    return ctx.redirect(ctx.router.url('users.profile', { id: user.id }));
  }
  return ctx.render('session/new', {
    email,
    createSessionPath: ctx.router.url('session.create'),
    error: 'Incorrect mail or password',
  });
});

router.get('session.destroy', '/logout', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('session.new'));
});

module.exports = router;
