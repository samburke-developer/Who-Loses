global.WebSocket = require('ws');

require('dotenv').config({ path: 'variables.env' });
const wshandler = require('../handlers/websocket-handler');

const app = require('../app');
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

wshandler.wsinit(server);
let roomArray = ['room1', 'room2', 'room3']

test('Rooms set array works', () => {
  expect(wss.setRooms(roomArray)).toEqual({'room1': 'room1', 'room2': 'room2', 'room3': 'room3'});
});

test('Get Room list returns rooms', () =>
{
    expect(wss.getRoomList()).toEqual({'room1': 'room1', 'room2': 'room2', 'room3': 'room3'});
})

server.close();
