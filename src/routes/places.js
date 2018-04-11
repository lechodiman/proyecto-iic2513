const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPlace(ctx, next) {
  ctx.state.place = await ctx.orm.place.findById(ctx.params.id);
  return next();
}

router.get('places.list', '/', async(ctx) => {
  const places = await ctx.orm.place.findAll();
  await ctx.render('places/index', {
    places,
    submitPlacePath: ctx.router.url('places.new'),
    editPlacePath: place => ctx.router.url('places.edit', { id: place.id }),
    deletePlacePath: place => ctx.router.url('places.delete', { id: place.id }),
  });
});

router.get('places.new', '/new', async(ctx) => {
  const place = ctx.orm.place.build();
  await ctx.render('places/new', {
    place,
    submitPlacePath: ctx.router.url('places.create'),
  });
});

router.post('places.create', '/', async(ctx) => {
  const place = ctx.orm.place.build(ctx.request.body);
  try {
    await place.save({
      fields: ['name', 'location', 'description']
    });
    ctx.redirect(ctx.router.url('places.list'));
  } catch (validationError) {
    await ctx.render('places/new', {
      place,
      errors: validationError.errors,
      submitPlacePath: ctx.router.url('places.create'),
    });
  }
});

router.get('places.edit', '/:id/edit', loadPlace, async (ctx) => {
  const { place } = ctx.state;
  await ctx.render('places/edit', {
    place,
    submitPlacePath: ctx.router.url('places.update', { id: place.id }),
  });
});


router.patch('places.update', '/:id', loadPlace, async (ctx) => {
  const { place } = ctx.state;
  try {
    const { name, location, description } = ctx.request.body;
    await place.update({ name, location, description });
    ctx.redirect(ctx.router.url('places.list'));
  } catch (validationError) {
    await ctx.render('places/edit', {
      place,
      errors: validationError.errors,
      submitPlacePath: ctx.router.url('places.update'),
    });
  }
});

router.del('places.delete', '/:id', loadPlace, async(ctx) => {
  const { place } = ctx.state;
  await place.destroy();
  ctx.redirect(ctx.router.url('places.list'));
});

module.exports = router;
