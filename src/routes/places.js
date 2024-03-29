const KoaRouter = require('koa-router');
const geocode = require('../services/mapbox');
const mapConfig = require('../config/map');

const router = new KoaRouter();

async function loadPlace(ctx, next) {
  ctx.state.place = await ctx.orm.place.findById(ctx.params.id);
  return next();
}

async function saveReview(ctx, next) {
  const user = ctx.state.currentUser;
  let comment = ctx.request.body.review;
  if (user) {
    comment = await ctx.orm.reviewPlace.build({ comment });
    comment = await comment.save();
    await comment.setUser(user.id);
    await comment.setPlace(ctx.params.id);
  }
  return next();
}

async function getReviews(ctx, next) {
  const reviewPlaces = await ctx.orm.reviewPlace.findAll({
    attributes: ['id', 'comment', 'userId', 'createdAt'],
    where: { placeId: ctx.params.id },
    order: [['createdAt', 'DESC']],
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
        result.push({ comment: reviewPlaces[i], sender: allUsers[i] });
      }
      ctx.state.reviews = result;
      return next();
    });
}


async function getRoutes(ctx) {
  const routes = await ctx.orm.route.findAll({ where: { placeId: ctx.params.id } });
  return routes;
}

router.get('places.index', '/', async (ctx) => {
  await ctx.render('places/index', {
    submitPlacePath: ctx.router.url('places.new'),
    editPlacePath: place => ctx.router.url('places.edit', { id: place.id }),
    deletePlacePath: place => ctx.router.url('places.delete', { id: place.id }),
    placePath: place => ctx.router.url('places.profile', { id: place.id }),
    admin: await ctx.state.isAdmin(),
  });
});

router.get('places.list', '/page/:number', async (ctx) => {
  ctx.redirect(ctx.router.url('places.index'));
});

router.get('places.new', '/new', async (ctx) => {
  const place = ctx.orm.place.build();
  await ctx.render('places/new', {
    place,
    submitPlacePath: ctx.router.url('places.create'),
  });
});

router.post('places.create', '/', async (ctx) => {
  let place = ctx.orm.place.build(ctx.request.body);
  if (await ctx.state.isAdmin()) {
    try {
      if (ctx.state.currentUser) {
        await place.save({
          fields: ['name', 'location', 'description'],
        });
      }
      ctx.redirect(ctx.router.url('places.list', { number: 1 }));
    } catch (validationError) {
      await ctx.render('places/new', {
        place,
        errors: validationError.errors,
        submitPlacePath: ctx.router.url('places.create'),
      });
    }
  } else {
    try {
      if (ctx.state.currentUser) {
        place = ctx.orm.suggestedPlace.build(ctx.request.body);
        await place.save({
          fields: ['name', 'location', 'description'],
        });
      }
      ctx.redirect(ctx.router.url('places.list', { number: 1 }));
    } catch (validationError) {
      await ctx.render('places/new', {
        place,
        errors: validationError.errors,
        submitPlacePath: ctx.router.url('places.create'),
      });
    }
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
    if (await ctx.state.isAdmin()) {
      await place.update({ name, location, description });
    }
    ctx.redirect(ctx.router.url('places.list', { number: 1 }));
  } catch (validationError) {
    await ctx.render('places/edit', {
      place,
      errors: validationError.errors,
      submitPlacePath: ctx.router.url('places.update'),
    });
  }
});

router.del('places.delete', '/:id', loadPlace, async (ctx) => {
  const { place } = ctx.state;
  if (await ctx.state.isAdmin()) {
    await place.destroy();
  }
  ctx.redirect(ctx.router.url('places.list', { number: 1 }));
});


router.get('places.profile', '/:id', loadPlace, getReviews, async (ctx) => {
  const { place } = ctx.state;

  const geolocation = await geocode(`${place.name}, ${place.location} Chile`);
  let location;
  try {
    location = geolocation.features[0].center;
  } catch (e) {
    location = await geocode(`${place.location} Chile`).features[0].center;
  }
  await ctx.render('places/profile', {
    place,
    lat: location[1],
    long: location[0],
    token: mapConfig.token,
    routes: await getRoutes(ctx),
    reviews: ctx.state.reviews,
    placePath: _place => ctx.router.url('places.profile', { id: _place.id }),
    routePath: _route => ctx.router.url('routes.profile', { id: ctx.params.id, route_id: _route.id }),
    submitRoutePath: ctx.router.url('routes.new', { id: ctx.params.id }),
    mapPath: ctx.router.url('places.map', { id: place.id, lat: location[1], long: location[0] }),
  });
});

router.post('places.profile', '/:id', loadPlace, saveReview, getReviews, async (ctx) => {
  ctx.redirect(ctx.router.url('places.profile', { id: ctx.params.id }));
});

router.get('places.map', '/:id/map/:lat/:long', loadPlace, async (ctx) => {
  const { place } = ctx.state;
  await ctx.render('places/map', {
    place,
    lat: parseFloat(ctx.params.lat),
    long: parseFloat(ctx.params.long),
    token: mapConfig.token,
  });
});


module.exports = router;
