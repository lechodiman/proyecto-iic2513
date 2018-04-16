const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadAchievemts(ctx, next) {
    ctx.state.achievemt = await ctx.orm.achievemt.findById(ctx.params.id);
    return next();
  }

  router.get('achievements.list', '/', async(ctx) => {
    const achievements = await ctx.orm.achievements.findAll();
    await ctx.render('achievements/index', {
      achievements,
      submitachievementsPath: ctx.router.url('achievements.new'),
      editachievementsPath: achievements => ctx.router.url('achievements.edit', { id: achievements.id }),
      deleteachievementsPath: achievements => ctx.router.url('achievements.delete', { id: achievements.id }),
      achievementsPath: achievements => ctx.router.url('achievements.profile', { id: achievements.id }),
    });
  });

  router.get('achievements.new', '/new', async(ctx) => {
    const achievements = ctx.orm.achievements.build();
    await ctx.render('achievements/new', {
      achievements,
      submitachievementsPath: ctx.router.url('achievements.create'),
    });
  });
  
  router.post('achievements.create', '/', async(ctx) => {
    const achievements = ctx.orm.achievements.build(ctx.request.body);
    try {
      await achievements.save({
        fields: ['name', 'description', ]
      });
      ctx.redirect(ctx.router.url('achievements.list'));
    } catch (validationError) {
      await ctx.render('achievements/new', {
        achievements,
        errors: validationError.errors,
        submitachievementsPath: ctx.router.url('achievements.create'),
      });
    }
  });

module.exports = router;