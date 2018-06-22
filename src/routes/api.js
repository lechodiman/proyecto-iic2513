const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  return next();
}

async function isMember(ctx, groupId, member) {
  if (!member) {
    return false;
  }

  return ctx.orm.groupMembers.findOne({
    where: {
      memberId: member.id,
      groupId,
    },
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
    ctx.state.message = comment;
    ctx.state.sender = sender;
  }
  return next();
}

async function getComments(ctx, next) {
  // I modified this to send comment already formatted
  const profileComments = await ctx.orm.profileComment.findAll({
    attributes: ['id', 'comment', 'SenderId', 'createdAt'],
    where: { ReceiverId: ctx.params.id },
    order: [['createdAt', 'ASC']],
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
        const thisComment = profileComments[i];
        result.push({
          id: thisComment.id,
          comment: thisComment.comment,
          createdAt: thisComment.createdAt,
          user: allUsers[i].name,
        });
      }
      ctx.state.comments = result;
      return next();
    });
}

async function loadPlace(ctx, next) {
  ctx.state.place = await ctx.orm.place.findById(ctx.params.id);
  return next();
}

async function saveReview(ctx, next) {
  const user = ctx.state.currentUser;
  let { comment } = ctx.request.body;
  if (user) {
    comment = await ctx.orm.reviewPlace.build({ comment });
    comment = await comment.save();
    await comment.setUser(user.id);
    await comment.setPlace(ctx.params.id);
    ctx.state.message = comment;
  }
  return next();
}

async function getReviews(ctx, next) {
  const reviewPlaces = await ctx.orm.reviewPlace.findAll({
    attributes: ['id', 'comment', 'userId', 'createdAt'],
    where: { placeId: ctx.params.id },
    order: [['createdAt', 'ASC']],
  });
  const users = [];

  reviewPlaces.forEach((reviewPlace) => {
    const user = ctx.orm.user.findOne({ where: { id: reviewPlace.userId } });
    users.push(user);
  });

  return Promise.all(users)
    .then((allUsers) => {
      const result = [];
      for (let i = 0; i < allUsers.length; i += 1) {
        const thisReview = reviewPlaces[i];
        result.push({
          id: thisReview.id,
          comment: thisReview.comment,
          createdAt: thisReview.createdAt,
          user: allUsers[i].name,
        });
      }
      ctx.state.reviews = result;
      return next();
    });
}

async function loadRoute(ctx, next) {
  ctx.state.route = await ctx.orm.route.findById(ctx.params.id);
  return next();
}

async function saveRouteReview(ctx, next) {
  const user = ctx.state.currentUser;
  let { comment } = ctx.request.body;
  if (user) {
    comment = await ctx.orm.reviewRoute.build({ comment });
    comment = await comment.save();
    await comment.setUser(user.id);
    await comment.setRoute(ctx.params.id);
    ctx.state.message = comment;
  }
  return next();
}

async function getRouteReviews(ctx, next) {
  const reviewRoutes = await ctx.orm.reviewRoute.findAll({
    attributes: ['id', 'comment', 'userId', 'createdAt'],
    where: { routeId: ctx.params.id },
    order: [['createdAt', 'ASC']],
  });
  const users = [];

  reviewRoutes.forEach((reviewRoute) => {
    const user = ctx.orm.user.findOne({ where: { id: reviewRoute.userId } });
    users.push(user);
  });

  return Promise.all(users)
    .then((allUsers) => {
      const result = [];
      for (let i = 0; i < allUsers.length; i += 1) {
        const thisReview = reviewRoutes[i];
        result.push({
          id: thisReview.id,
          comment: thisReview.comment,
          createdAt: thisReview.createdAt,
          user: allUsers[i].name,
        });
      }
      ctx.state.reviews = result;
      return next();
    });
}


async function getRoutesFromPlace(ctx, placeId) {
  const routes = await ctx.orm.route.findAll({
    where: { placeId },
    attributes: ['id', 'name', 'description'],
  });
  return routes;
}

// Groups

async function loadGroup(ctx, next) {
  ctx.state.group = await ctx.orm.group.findById(ctx.params.id);
  return next();
}

async function saveGroupComment(ctx, next) {
  const user = ctx.state.currentUser;
  let { comment } = ctx.request.body;
  if (await isMember(ctx, ctx.params.id, user)) {
    comment = await ctx.orm.groupComment.build({ comment });
    comment = await comment.save();
    await comment.setUser(user.id);
    await comment.setGroup(ctx.params.id);
    ctx.state.message = comment;
  }
  return next();
}

async function getGroupComments(ctx, next) {
  const groupComments = await ctx.orm.groupComment.findAll({
    attributes: ['id', 'comment', 'userId', 'createdAt'],
    where: { groupId: ctx.params.id },
    order: [['createdAt', 'DESC']],
  });
  const users = [];

  groupComments.forEach((groupComment) => {
    const user = ctx.orm.user.findOne({ where: { id: groupComment.userId } });
    users.push(user);
  });

  return Promise.all(users)
    .then((allUsers) => {
      const result = [];
      for (let i = 0; i < allUsers.length; i += 1) {
        const thisComment = groupComments[i];
        result.push({
          id: thisComment.id,
          comment: thisComment.comment,
          createdAt: thisComment.createdAt,
          user: allUsers[i].name,
        });
      }
      ctx.state.groupComments = result;
      return next();
    });
}

// Public API

router.get('api.places.list', '/place', async (ctx) => {
  // Get all places with their respective information
  const places = await ctx.orm.place.findAll({ attributes: ['id', 'name', 'location', 'description'] });
  const routes = await ctx.orm.route.findAll({ attributes: ['id', 'name', 'description', 'placeId'] });

  const res = [];
  places.forEach((place) => {
    const placeInfo = {
      id: place.id,
      name: place.name,
      location: place.location,
      description: place.description,
      routes: [],
    };
    routes.forEach((route) => {
      if (route.placeId === place.id) {
        placeInfo.routes.push({
          id: route.id,
          name: route.name,
          description: route.description,
        });
      }
    });
    res.push(placeInfo);
  });
  ctx.body = { places: res };
});

router.get('api.places.info', '/place/:id', async (ctx) => {
  // Get place information
  const place = await ctx.orm.place.findById(ctx.params.id);
  const res = {
    id: place.id,
    name: place.name,
    location: place.location,
    description: place.description,
    routes: await getRoutesFromPlace(ctx, place.id),
  };
  ctx.body = res;
});

router.get('api.routes.', '/route', async (ctx) => {
  // Get all routes with their respective information
  const routes = await ctx.orm.route.findAll({ attributes: ['id', 'name', 'description', 'placeId'] });
  ctx.body = { routes };
});

router.get('api.places.info.reviews', '/place/:id/reviews', getReviews, async (ctx) => {
  // Get place information
  const place = await ctx.orm.place.findById(ctx.params.id);
  const res = {
    id: place.id,
    name: place.name,
    location: place.location,
    description: place.description,
    routes: await getRoutesFromPlace(ctx, place.id),
  };
  ctx.body = res;
});

router.get('api.users.comment.list', '/user/profile/:id', loadUser, getComments, async (ctx) => {
  // Get all comments from a user profile
  ctx.body = { comments: ctx.state.comments };
});

router.post('api.users.comment', '/user/profile/:id', loadUser, saveComment, async (ctx) => {
  // Post a comment to a user profile
  ctx.body = {
    user: ctx.state.currentUser.name,
    message: ctx.state.message.comment,
    createdAt: ctx.state.message.createdAt,
  };
});

router.get('api.places.review.list', '/place/profile/:id', loadPlace, getReviews, async (ctx) => {
  // Get all reviews of a place
  ctx.body = { comments: ctx.state.reviews };
});

router.post('api.places.review', '/place/profile/:id', loadPlace, saveReview, async (ctx) => {
  // Post a review to a place
  ctx.body = {
    user: ctx.state.currentUser.name,
    message: ctx.state.message.comment,
    createdAt: ctx.state.message.createdAt,
  };
});

router.get('api.routes.review.list', '/route/profile/:id', loadRoute, getRouteReviews, async (ctx) => {
  // Get all reviews of a route
  ctx.body = { comments: ctx.state.reviews };
});

router.post('api.routes.review', '/route/profile/:id', loadRoute, saveRouteReview, async (ctx) => {
  // Post a review to a route
  ctx.body = {
    user: ctx.state.currentUser.name,
    message: ctx.state.message.comment,
    createdAt: ctx.state.message.createdAt,
  };
});

router.get('api.groups.comment.list', '/group/profile/:id', loadGroup, getGroupComments, async (ctx) => {
  // Get all comments of a group
  ctx.body = { comments: ctx.state.groupComments };
});

router.post('api.groups.comment', '/group/profile/:id', loadGroup, saveGroupComment, async (ctx) => {
  // Post a comment to a group
  ctx.body = {
    user: ctx.state.currentUser.name,
    message: ctx.state.message.comment,
    createdAt: ctx.state.message.createdAt,
  };
});

module.exports = router;
