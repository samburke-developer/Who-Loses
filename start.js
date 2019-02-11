global.WebSocket = require('ws');

require('dotenv').config({ path: 'variables.env' });
const wshandler = require('./handlers/websocket-handler');

const app = require('./app');
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

wshandler.wsinit(server);

