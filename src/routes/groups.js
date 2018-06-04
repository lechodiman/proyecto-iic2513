const KoaRouter = require('koa-router');
const sendGroupEmail = require('../mailers/create-group');

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

async function saveComment(ctx, next) {
  const user = ctx.state.currentUser;
  let { comment } = ctx.request.body;
  if (await isMember(ctx, ctx.params.id, user)) {
    comment = await ctx.orm.groupComment.build({ comment });
    comment = await comment.save();
    await comment.setUser(user.id);
    await comment.setGroup(ctx.params.id);
  }
  return next();
}

async function getComments(ctx, next) {
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
        result.push({ comment: groupComments[i], user: allUsers[i] });
      }
      ctx.state.groupComments = result;
      return next();
    });
}

async function saveMember(ctx, next) {
  const user = ctx.state.currentUser;
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
    members.push(user);
  });

  return Promise.all(members)
    .then((allMembers) => {
      const formattedMembers = [];
      allMembers.forEach((member) => {
        formattedMembers.push({
          id: member.id,
          name: member.name,
        });
      });
      ctx.state.members = formattedMembers;
      return next();
    });
}


router.get('groups.list', '/page/:number', async (ctx) => {
  const num = parseInt(ctx.params.number, 10);
  const groups = await ctx.orm.group.findAll({ limit: 5, offset: 5 * (num - 1) });
  await ctx.render('groups/index', {
    groups,
    submitGroupPath: ctx.router.url('groups.new'),
    editGroupPath: group => ctx.router.url('groups.edit', { id: group.id }),
    deleteGroupPath: group => ctx.router.url('groups.delete', { id: group.id }),
    profilePathGroup: group => ctx.router.url('groups.profile', { id: group.id }),
    admin: await ctx.state.isAdmin(),
    nextPagePath: () => ctx.router.url('groups.list', { number: num + 1 }),
    previousPagePath: () => ctx.router.url('groups.list', { number: num - 1 }),
    pageNumber: num,
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
    if (ctx.state.currentUser) {
      await group.save({
        fields: ['name'],
      });
      await saveMember(ctx, () => { });
      await sendGroupEmail(ctx, ctx.state.currentUser);
    }
    ctx.redirect(ctx.router.url('groups.profile', {
      id: group.id,
    }));
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
    if (ctx.state.currentUser) {
      const { name } = ctx.request.body;
      await group.update({
        name,
      });
    }
    ctx.redirect(ctx.router.url('groups.list', { number: 1 }));
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
  ctx.redirect(ctx.router.url('groups.list', { number: 1 }));
});

router.get('groups.profile', '/profile/:id', loadGroup, getComments, getMembers, async (ctx) => {
  const { group } = ctx.state;
  const user = ctx.state.currentUser;
  await ctx.render('groups/profile', {
    group,
    members: ctx.state.members,
    comments: ctx.state.groupComments,
    commentPath: ctx.router.url('groups.comments', { id: ctx.params.id }),
    alredyMember: await isMember(ctx, ctx.params.id, user),
    profilePathGroup: _group => ctx.router.url('groups.profile', {
      id: _group.id,
    }),
  });
});


router.post('groups.profile', '/profile/:id', loadGroup, saveMember, getMembers, async (ctx) => {
  ctx.redirect(ctx.router.url('groups.profile', {
    id: ctx.params.id,
  }));
});

router.post('groups.comments', '/profile/:id/comment', loadGroup, saveComment, getComments, async (ctx) => {
  ctx.redirect(ctx.router.url('groups.profile', {
    id: ctx.params.id,
  }));
});

module.exports = router;
