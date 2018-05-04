const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadRoute(ctx, next) {
  ctx.state.route = await ctx.orm.route.findById(ctx.params.route_id);
  return next();
}

async function saveReview(ctx, next) {
  let comment = ctx.request.body.review;
  const user = ctx.state.currentUser;
  if (user) {
    comment = await ctx.orm.reviewRoute.build({ comment });
    comment = await comment.save();
    await comment.setUser(user.id);
    await comment.setRoute(ctx.params.route_id);
  }
  return next();
}

async function getReviews(ctx, next) {
  ctx.state.reviews = await ctx.orm.reviewRoute.findAll({
    attributes: ['id', 'comment', 'userId', 'createdAt'],
    where: { routeId: ctx.params.route_id },
    order: [['createdAt', 'DESC']],
  });
  return next();
}

router.get('routes.new', '/new', async (ctx) => {
  const route = ctx.orm.route.build();
  await ctx.render('routes/new', {
    route,
    submitRoutePath: ctx.router.url('routes.create', { id: ctx.params.id }),
  });
});

router.post('routes.create', '/', async (ctx) => {
  const placeId = ctx.params.id;
  const route = ctx.orm.route.build(ctx.request.body);
  try {
    await route.save({
      fields: ['name', 'description'],
    });
    route.setPlace(placeId);
    ctx.redirect(ctx.router.url('routes.profile', { id: ctx.params.id, route_id: route.id }));
  } catch (validationError) {
    await ctx.render('routes/new', {
      route,
      errors: validationError.errors,
      submitRoutePath: ctx.router.url('routes.create', { id: ctx.params.id }),
    });
  }
});

router.get('routes.edit', '/:route_id/edit', loadRoute, async (ctx) => {
  const { route } = ctx.state;
  await ctx.render('routes/edit', {
    route,
    submitRoutePath: ctx.router.url('routes.update', { id: ctx.params.id, route_id: route.id }),
  });
});


router.patch('routes.update', '/:route_id', loadRoute, async (ctx) => {
  const { route } = ctx.state;
  try {
    const { name, description } = ctx.request.body;
    await route.update({ name, description });
    ctx.redirect(ctx.router.url('routes.profile', { id: ctx.params.id, route_id: route.id }));
  } catch (validationError) {
    await ctx.render('routes/edit', {
      route,
      errors: validationError.errors,
      submitRoutePath: ctx.router.url('routes.update', { id: ctx.params.id, route_id: route.id }),
    });
  }
});

router.del('routes.delete', '/:route_id', loadRoute, async (ctx) => {
  const { route } = ctx.state;
  await route.destroy();
  ctx.redirect(ctx.router.url('places.profile', { id: ctx.params.id }));
});

router.get('routes.profile', '/:route_id', loadRoute, getReviews, async (ctx) => {
  const { route } = ctx.state;
  await ctx.render('routes/profile', {
    route,
    reviews: ctx.state.reviews,
    routePath: _route => ctx.router.url('routes.profile', { id: ctx.params.id, route_id: _route.id }),
    routeAddPath: _route => ctx.router.url('routes.add', { id: ctx.params.id, route_id: _route.id }),
  });
});

router.post('routes.profile', '/:route_id', loadRoute, saveReview, getReviews, async (ctx) => {
  ctx.redirect(ctx.router.url('routes.profile', { id: ctx.params.id, route_id: ctx.params.route_id }));
});

router.post('routes.add', '/:route_id/add', loadRoute, async (ctx) => {
  const user = ctx.state.currentUser;
  let routeCount = await ctx.orm.routeCount
    .findOne({ where: { userId: user.id, routeId: ctx.params.route_id } });

  if (!routeCount) {
    routeCount = ctx.orm.routeCount.build({ route_count: 1 });
    await routeCount.save();
    await routeCount.setUser(user.id);
    await routeCount.setRoute(ctx.params.route_id);
  } else {
    routeCount.route_count += 1;
    await routeCount.save();
  }


  ctx.redirect(ctx.router.url('routes.profile', { id: ctx.params.id, route_id: ctx.params.route_id }));
});

module.exports = router;
