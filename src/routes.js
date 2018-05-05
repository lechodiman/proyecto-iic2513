const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const places = require('./routes/places');
const routes = require('./routes/routes');
const groups = require('./routes/groups');
const miscs = require('./routes/misc');
const session = require('./routes/session');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    currentUser: ctx.session.userId && await ctx.orm.user.findById(ctx.session.userId),
    newSessionPath: ctx.router.url('session.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    profilePath: user => ctx.router.url('users.profile', { id: user.id }),
    isAdmin: async () => {
      if (!ctx.state.currentUser) { return false; }
      return ctx.orm.admin.findOne({ where: { adminId: ctx.session.userId } });
    },
  });
  return next();
});


router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/places', places.routes());
router.use('/places/:id/routes', routes.routes());
router.use('/groups', groups.routes());
router.use('/misc', miscs.routes());
router.use('/session', session.routes());

module.exports = router;
