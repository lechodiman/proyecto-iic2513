const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();


router.get('/', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  await ctx.render('/index', {
    users,
    submitUserPath: ctx.router.url('users.new'),
    editUserPath: user => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: user => ctx.router.url('users.delete', { id: user.id }),
    profilePath: user => ctx.router.url('users.profile', { id: user.id }),
    admin: await ctx.state.isAdmin(),
  });
});

router.get('/', async (ctx) => {
  await ctx.render('index', { appVersion: pkg.version });
});
module.exports = router;
