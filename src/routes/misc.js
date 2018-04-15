const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('faq', '/faq', async (ctx) => {
  await ctx.render('misc/faq');
});

router.get('tips', '/tips', async (ctx) => {
  await ctx.render('misc/tips');
});


module.exports = router;
