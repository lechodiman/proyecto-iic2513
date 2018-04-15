const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  return next();
}

async function saveComment(ctx, next) {
  const name = ctx.request.body.name;
  let comment = ctx.request.body.comment;
  const sender = await ctx.orm.user.findOne({ where: {name: name} });
  if (sender) {
    comment = await ctx.orm.profileComment.build({comment});
    comment = await comment.save();
    await comment.setSender(sender.id);
    await comment.setReceiver(ctx.params.id);
  }
  return next();
}

async function getComments(ctx, next) {
  ctx.state.comments = await ctx.orm.profileComment.findAll({
                                  attributes: ['id', 'comment', 'SenderId', 'createdAt'],
                                  where: { ReceiverId: ctx.params.id},
                                  order: [ ['createdAt', 'DESC'], ],
                                  });
  return next();
}

router.get('users.list', '/', async(ctx) => {
  const users = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    users,
    submitUserPath: ctx.router.url('users.new'),
    editUserPath: user => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: user => ctx.router.url('users.delete', { id: user.id }),
    profilePath: user => ctx.router.url('users.profile', { id: user.id }),
  });
});

router.get('users.new', '/new', async(ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async(ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({
      fields: ['name', 'email', 'password']
    });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
  });
});


router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const { name, email, password } = ctx.request.body;
    await user.update({ name, email, password });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update'),
    });
  }
});

router.del('users.delete', '/:id', loadUser, async(ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

router.get('users.profile', '/profile/:id', loadUser, getComments, async(ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/profile', {
    user,
    comments: ctx.state.comments,
    profilePath: user => ctx.router.url('users.profile', { id: user.id }),
  });
});


router.post('users.comment', '/profile/:id', loadUser, saveComment, getComments, async(ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/profile', {
    user,
    comments: ctx.state.comments,
    profilePath: user => ctx.router.url('users.profile', { id: user.id }),
  });
});





module.exports = router;
