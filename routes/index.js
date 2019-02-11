var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(wss.getRoomList())
  res.render('index', { title: 'Who Loses!', roomList: wss.getRoomList()});
});

// router.get('/check', function(req, res, next) {
//   wss.checkRooms()
//   res.sendStatus(200);
// });

router.get('/:room', function(req, res, next) {
  console.log(req.query)
  res.render('index', { title: `${decodeURI(req.params.room)}`, roomList: wss.getRoomList()});
});

router.post('/:room', function(req, res, next) 
{
  wss.informRoom('announceLoser', {user: wss.getRandomUser(req.params.room)}, req.params.room)
  res.send(200);
});

module.exports = router;
