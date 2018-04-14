const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadRoute(ctx, next) {
  ctx.state.route = await ctx.orm.route.findById(ctx.params.id);
  return next();
}

router.get('routes.list', '/', async(ctx) => {
  const routes = await ctx.orm.route.findAll();
  await ctx.render('routes/index', {
    routes,
    submitRoutePath: ctx.router.url('routes.new'),
    editRoutePath: route => ctx.router.url('routes.edit', { id: route.id }),
    deleteRoutePath: route => ctx.router.url('routes.delete', { id: route.id }),
  });
});

router.get('routes.new', '/new', async(ctx) => {
  const route = ctx.orm.route.build();
  await ctx.render('routes/new', {
    route,
    submitRoutePath: ctx.router.url('routes.create'),
  });
});

router.post('routes.create', '/', async(ctx) => {
  const route = ctx.orm.route.build(ctx.request.body);
  try {
    await route.save({
      fields: ['name', 'description']
    });
    ctx.redirect(ctx.router.url('routes.list'));
  } catch (validationError) {
    await ctx.render('routes/new', {
      route,
      errors: validationError.errors,
      submitRoutePath: ctx.router.url('routes.create'),
    });
  }
});

router.get('routes.edit', '/:id/edit', loadRoute, async (ctx) => {
  const { route } = ctx.state;
  await ctx.render('routes/edit', {
    route,
    submitRoutePath: ctx.router.url('routes.update', { id: route.id }),
  });
});


router.patch('routes.update', '/:id', loadRoute, async (ctx) => {
  const { route } = ctx.state;
  try {
    const { name, description } = ctx.request.body;
    await route.update({ name, description });
    ctx.redirect(ctx.router.url('routes.list'));
  } catch (validationError) {
    await ctx.render('routes/edit', {
      route,
      errors: validationError.errors,
      submitRoutePath: ctx.router.url('routes.update'),
    });
  }
});

router.del('routes.delete', '/:id', loadRoute, async(ctx) => {
  const { route } = ctx.state;
  await route.destroy();
  ctx.redirect(ctx.router.url('routes.list'));
});

module.exports = router;
