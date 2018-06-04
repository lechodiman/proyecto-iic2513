const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('suggestedPlaces.list', '/places/page/:number', async (ctx) => {
  const num = parseInt(ctx.params.number, 10);
  const places = await ctx.orm.suggestedPlace.findAll({ limit: 5, offset: 5 * (num - 1) });
  if (await ctx.state.isAdmin()) {
    await ctx.render('suggestedPlaces/index', {
      places,
      acceptPlacePath: place => ctx.router.url('suggestedPlaces.create', { id: place.id }),
      deletePlacePath: place => ctx.router.url('suggestedPlaces.delete', { id: place.id }),
      admin: await ctx.state.isAdmin(),
      nextPagePath: () => ctx.router.url('suggestedPlaces.list', { number: num + 1 }),
      previousPagePath: () => ctx.router.url('suggestedPlaces.list', { number: num - 1 }),
      pageNumber: num,
    });
  }
});


router.post('suggestedPlaces.create', '/places/:id', async (ctx) => {
  const suggestedPlace = await ctx.orm.suggestedPlace.findOne({ where: { id: ctx.params.id } });
  if (await ctx.state.isAdmin()) {
    try {
      const place = await ctx.orm.place.build();
      place.name = suggestedPlace.name;
      place.location = suggestedPlace.location;
      place.description = suggestedPlace.description;
      await place.save();
      await suggestedPlace.destroy();
      ctx.redirect(ctx.router.url('suggestedPlaces.list', { number: 1 }));
    } catch (validationError) {
      ctx.redirect(ctx.router.url('suggestedPlaces.list', { number: 1 }));
    }
  }
});

router.del('suggestedPlaces.delete', '/:id', async (ctx) => {
  const suggestedPlace = await ctx.orm.suggestedPlace.findOne({ where: { id: ctx.params.id } });
  if (await ctx.state.isAdmin()) {
    try {
      await suggestedPlace.destroy();
      ctx.redirect(ctx.router.url('suggestedPlaces.list', { number: 1 }));
    } catch (validationError) {
      ctx.redirect(ctx.router.url('suggestedPlaces.list', { number: 1 }));
    }
  }
});

module.exports = router;
