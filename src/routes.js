const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const places = require('./routes/places');
const routes = require('./routes/routes');
const groups = require('./routes/groups');
const miscs = require('./routes/misc');


const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/places', places.routes());
router.use('/routes', routes.routes());
router.use('/groups', groups.routes());
router.use('/misc', miscs.routes());

module.exports = router;
