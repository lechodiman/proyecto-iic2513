const KoaRouter = require('koa-router');
const sendWelcomeEmail = require('../mailers/signup-alert');
const uploadFile = require('../services/file-storage');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  return next();
}

async function loadRoutes(ctx, next) {
  const routesCount = await ctx.orm.routeCount.findAll({
    where: { userId: ctx.state.user.id },
  });

  const routes = [];

  routesCount.forEach((routeCount) => {
    const route = ctx.orm.route.findOne({ where: { id: routeCount.routeId } });
    routes.push(route);
  });

  return Promise.all(routes)
    .then((allRoutes) => {
      const stats = [];
      for (let i = 0; i < routesCount.length; i += 1) {
        stats.push({ route: allRoutes[i], count: routesCount[i].route_count });
      }
      ctx.state.routes = stats;
      return next();
    });
}

async function loadAchievements(ctx, next) {
  const achIds = await ctx.orm.achievementUser.findAll({ where: { userId: ctx.state.user.id } });

  const trophies = [];

  achIds.forEach((achId) => {
    const trophy = ctx.orm.achievement.findOne({ where: { id: achId.achievementId } });
    trophies.push(trophy);
  });

  return Promise.all(trophies)
    .then((allTrophies) => {
      ctx.state.achievements = allTrophies;
      return next();
    });
}

async function saveComment(ctx, next) {
  let { comment } = ctx.request.body;
  const sender = ctx.state.currentUser;
  if (sender) {
    comment = await ctx.orm.profileComment.build({ comment });
    comment = await comment.save();
    await comment.setSender(sender.id);
    await comment.setReceiver(ctx.params.id);
  }
  return next();
}

async function getComments(ctx, next) {
  const profileComments = await ctx.orm.profileComment.findAll({
    attributes: ['id', 'comment', 'SenderId', 'createdAt'],
    where: { ReceiverId: ctx.params.id },
    order: [['createdAt', 'DESC']],
  });

  const users = [];

  profileComments.forEach((profileComment) => {
    const user = ctx.orm.user.findOne({ where: { id: profileComment.SenderId } });
    users.push(user);
  });

  return Promise.all(users)
    .then((allUsers) => {
      const result = [];
      for (let i = 0; i < allUsers.length; i += 1) {
        result.push({ comment: profileComments[i], sender: allUsers[i] });
      }
      ctx.state.comments = result;
      return next();
    });
}

router.get('users.list', '/page/:number', async (ctx) => {
  const num = parseInt(ctx.params.number, 10);
  const users = await ctx.orm.user.findAll({ limit: 5, offset: 5 * (num - 1) });
  await ctx.render('users/index', {
    users,
    submitUserPath: ctx.router.url('users.new'),
    editUserPath: user => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: user => ctx.router.url('users.delete', { id: user.id }),
    profilePath: user => ctx.router.url('users.profile', { id: user.id }),
    admin: await ctx.state.isAdmin(),
    nextPagePath: () => ctx.router.url('users.list', { number: num + 1 }),
    previousPagePath: () => ctx.router.url('users.list', { number: num - 1 }),
    pageNumber: num,
  });
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({
      fields: ['name', 'email', 'password'],
    });
    ctx.session.userId = user.id;
    await sendWelcomeEmail(ctx, { user });
    ctx.redirect(ctx.router.url('users.profile', { id: user.id }));
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
  if (await ctx.state.isAdmin()) {
    const { user } = ctx.state;
    try {
      const { name, email, password } = ctx.request.body;
      await user.update({ name, email, password });
      ctx.redirect(ctx.router.url('users.list', { number: 1 }));
    } catch (validationError) {
      await ctx.render('users/edit', {
        user,
        errors: validationError.errors,
        submitUserPath: ctx.router.url('users.update', { id: user.id }),
      });
    }
  } else {
    ctx.redirect(ctx.router.url('users.list', { number: 1 }));
  }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
  if (await ctx.state.isAdmin()) {
    const { user } = ctx.state;
    await user.destroy();
  }
  ctx.redirect(ctx.router.url('users.list', { number: 1 }));
});

router.get('users.profile', '/profile/:id', loadUser, loadRoutes, loadAchievements, getComments, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/profile', {
    user,
    comments: ctx.state.comments,
    routes: ctx.state.routes,
    achievements: ctx.state.achievements,
    profilePath: _user => ctx.router.url('users.profile', { id: _user.id }),
    submitPicturePath: ctx.router.url('users.picture', { id: user.id }),
  });
});


router.post('users.comment', '/profile/:id', loadUser, saveComment, getComments, async (ctx) => {
  ctx.redirect(ctx.router.url('users.profile', { id: ctx.params.id }));
});

router.post('users.picture', '/profile/:id/picture', loadUser, async (ctx) => {
  const { image } = ctx.request.body.files;

  if (ctx.state.currentUser.id === ctx.state.user.id) {
    await uploadFile(ctx, `${ctx.state.user.id}.png`, image);
    await ctx.state.user.update({ picture: ctx.state.url });
  }


  ctx.redirect(ctx.router.url('users.profile', { id: ctx.params.id }));
});


module.exports = router;
