const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadGroup(ctx, next) {
  ctx.state.group = await ctx.orm.group.findById(ctx.params.id);
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

async function saveMember(ctx, next) {
  const {
    name,
  } = ctx.request.body;
  const user = await ctx.orm.user.findOne({
    where: {
      name,
    },
  });
  const alreadyMember = await isMember(ctx, ctx.params.id, user);
  if (user && await !alreadyMember) {
    let groupInfo = await ctx.orm.groupMembers.build();
    groupInfo = await groupInfo.save();
    await groupInfo.setGroup(ctx.params.id);
    await groupInfo.setMember(user.id);
  }
  return next();
}

async function getMembers(ctx, next) {
  const membersId = await ctx.orm.groupMembers.findAll({
    where: {
      groupId: ctx.params.id,
    },
  });
  const members = [];

  membersId.forEach((member) => {
    const user = ctx.orm.user.findOne({
      where: {
        id: member.memberId,
      },
    });

    const newMember = {
      id: member.memberId,
      name: user.name,
    };
    members.push(newMember);
  });

  ctx.state.members = await Promise.all(members);

  return next();
}


router.get('groups.list', '/', async (ctx) => {
  const groups = await ctx.orm.group.findAll();
  await ctx.render('groups/index', {
    groups,
    submitGroupPath: ctx.router.url('groups.new'),
    editGroupPath: group => ctx.router.url('groups.edit', {
      id: group.id,
    }),
    deleteGroupPath: group => ctx.router.url('groups.delete', {
      id: group.id,
    }),
    profilePath: group => ctx.router.url('groups.profile', {
      id: group.id,
    }),
  });
});

router.get('groups.new', '/new', async (ctx) => {
  const group = ctx.orm.group.build();
  await ctx.render('groups/new', {
    group,
    submitGroupPath: ctx.router.url('groups.create'),
  });
});

router.post('groups.create', '/', async (ctx) => {
  const group = ctx.orm.group.build(ctx.request.body);
  try {
    await group.save({
      fields: ['name'],
    });
    ctx.redirect(ctx.router.url('groups.list'));
  } catch (validationError) {
    await ctx.render('groups/new', {
      group,
      errors: validationError.errors,
      submitGroupPath: ctx.router.url('groups.create'),
    });
  }
});

router.get('groups.edit', '/:id/edit', loadGroup, async (ctx) => {
  const { group } = ctx.state;
  await ctx.render('groups/edit', {
    group,
    submitGroupPath: ctx.router.url('groups.update', {
      id: group.id,
    }),
  });
});


router.patch('groups.update', '/:id', loadGroup, async (ctx) => {
  const { group } = ctx.state;
  try {
    const { name } = ctx.request.body;
    await group.update({
      name,
    });
    ctx.redirect(ctx.router.url('groups.list'));
  } catch (validationError) {
    await ctx.render('groups/edit', {
      group,
      errors: validationError.errors,
      submitGroupPath: ctx.router.url('groups.update', {
        id: group.id,
      }),
    });
  }
});

router.del('groups.delete', '/:id', loadGroup, async (ctx) => {
  const { group } = ctx.state;
  await group.destroy();
  ctx.redirect(ctx.router.url('groups.list'));
});

router.get('groups.profile', '/profile/:id', loadGroup, getMembers, async (ctx) => {
  const { group } = ctx.state;
  await ctx.render('groups/profile', {
    group,
    members: ctx.state.members,
    profilePath: _group => ctx.router.url('groups.profile', {
      id: _group.id,
    }),
  });
});


router.post('groups.comment', '/profile/:id', loadGroup, saveMember, getMembers, async (ctx) => {
  ctx.redirect(ctx.router.url('groups.profile', {
    id: ctx.params.id,
  }));
});


module.exports = router;
