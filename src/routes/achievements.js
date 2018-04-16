const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadAchievemts(ctx, next) {
    ctx.state.achievemt = await ctx.orm.achievemt.findById(ctx.params.id);
    return next();
  }

  router.get('achievements.list', '/', async(ctx) => {
    const achievements = await ctx.orm.place.findAll();
    await ctx.render('achievements/index', {
      achievements,
      submitPlacePath: ctx.router.url('achievements.new'),
      editPlacePath: place => ctx.router.url('achievements.edit', { id: place.id }),
      deletePlacePath: place => ctx.router.url('achievements.delete', { id: place.id }),
      placePath: place => ctx.router.url('achievements.profile', { id: place.id }),
    });
  });

  router.get('achievements.new', '/new', async(ctx) => {
    const place = ctx.orm.place.build();
    await ctx.render('achievements/new', {
      place,
      submitPlacePath: ctx.router.url('achievements.create'),
    });
  });
  
  router.post('achievements.create', '/', async(ctx) => {
    const place = ctx.orm.place.build(ctx.request.body);
    try {
      await place.save({
        fields: ['name', 'description', ]
      });
      ctx.redirect(ctx.router.url('achievements.list'));
    } catch (validationError) {
      await ctx.render('achievements/new', {
        place,
        errors: validationError.errors,
        submitPlacePath: ctx.router.url('achievements.create'),
      });
    }
  });

module.exports = router;