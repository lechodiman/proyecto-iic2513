const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  return next();
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
  let profileComments = await ctx.orm.profileComment.findAll({
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
        let thisComment = profileComments[i];
        result.push({
          id: thisComment.id,
          comment: thisComment.comment,
          createdAt: thisComment.createdAt,
          user: allUsers[i].name
         });
      }
      ctx.state.comments = result;
      return next();
    });
}

router.get('api.users.comment.list', '/user/comments/:id', loadUser, getComments, async (ctx) => {
  switch (ctx.accepts('json')) {
    case 'json':
      ctx.body = { comments: ctx.state.comments };
      break;
    default:
  }
});

router.post('api.users.comment', '/user/profile/:id', loadUser, saveComment, async (ctx) => {
  ctx.body = { user: ctx.state.currentUser.name, message: ctx.state.message.comment, createdAt: ctx.state.message.createdAt };
});
module.exports = router;
