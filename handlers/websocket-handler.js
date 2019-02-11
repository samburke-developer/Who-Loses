//intialises the Web socket object and adds a bunch of helpful functions
exports.wsinit = (server) =>
{
	let rooms = {};
	global.wss= new WebSocket.Server({server});
	
	wss.setRooms = function setRooms(array)
	{
		array.forEach(element => {
			rooms[element] = element;
		})
		return rooms;
	}

	//sends information to all connected users
	wss.broadcast = function broadcast(event, data) 
	{
		console.log("Broadcasting....")
		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({event: event, data: data}));
			}
		});
	};

	//sends information to connected users in a room
	wss.informRoom = function informRoom(event, data, room) 
	{
		if(rooms[room])
		{
			rooms[room].forEach(function each(client) 
			{
				if (client.ws.readyState === WebSocket.OPEN) 
				{
					client.ws.send(JSON.stringify({event: event, data: data}));
				}
			})
		}
	}

	wss.getRoomList = function getRoomList() 
	{
		return rooms
	}

	//Deletes empty room and notifies all connected users
	wss.checkRooms = function checkRooms() 
	{
		Object.keys(rooms).forEach((name) => {
			if(rooms[name].length < 1)
			{
				delete rooms[name];
				wss.broadcast("removedRoom", {room: name})
			}
		})
	}

	//check rooms every 15 minutes
	setInterval(function(){
		wss.checkRooms()
	},900000)
	
	wss.getRandomUser = function getRandomUser(room) 
	{
		return rooms[room][Math.floor(Math.random() * rooms[room].length)].name
	}

	//is called on user connection to websocket server
	wss.on('connection', ws => {
		//is called whena a user messages websocket server
		ws.on('message', message => 
		{
			message = JSON.parse(message);
			var room = decodeURIComponent(message.room);
			var user = {name: message.user, ws: ws}
			
			//if user is joining a room check is room already exists and create a new room if needed
			if (message.event == 'joining')
			{
				console.log(`${user.name} joined room ${room}`)
				if (rooms[room]) 
				{
					let index = rooms[room].findIndex((user) => user.name === message.user)
					if(index === -1)
					{
						rooms[room].push(user) 
					}else 
					{
						rooms[room][index] = user;
					}
					wss.broadcast('joinedRoom', {users: rooms[room].map((user) => user.name), room: room})
				} else {
					rooms[room] = [user];
					wss.broadcast("newRoom", {room: room, inRoom: rooms[room].length, users: rooms[room].map((user) => user.name) })
				}
				
			//if user is leaving a room reomve them from the room and notify other users
			} else if (message.event === 'leaving')
			{
				let name = message.user.replace(/ /g, "-")
				
				let index = rooms[room].findIndex((user) => user.name === message.user)
				if(index != null)
				{
					rooms[room].splice(index, 1);
				}
				wss.broadcast('leftRoom', {user: name, room: room, inRoom: rooms[room].length})
			}
			
		})
	})

	//called when connection is closed, removes user from room
	wss.on('close', ws => {
		
		let index = rooms[room].findIndex((user) => user.ws === ws)
		console.log("closing connection")
		
		if(index != null)
		{
			let user = rooms[room][index];
			console.log(`${user.name} left room ${room}`)
			rooms[room].splice(index, 1);
		}
	});
}