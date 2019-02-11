addToNodeList = (parent, child, position) => {
	if (position < 0 || position === null) {
		parent.appendChild(child);
	} else if (parent.childNodes.item(position)) {
		parent.insertBefore(child, parent.childNodes.item(position));
	}
};

removeNodeFromList = (child) => {
	if (child.parentNode) {
		child.parentNode.removeChild(child);
	}
};

removeSelf = (id) => {
	const node = document.querySelector(`div[data-target='#modal-${id}']`);
	removeNodeFromList(node);
};

addSelf = (id) => {
	const parent = document.querySelector('.drawn-tickets');
    const node = document.querySelector(`div[data-target='#modal-${id}']`);
    //console.log(parent)
	addToNodeList(parent, node, -1);
};

joinRoom = (action, room) =>{
	let user = sessionStorage.getItem('name');
	let currentRoom = location.href.split( '/' )[3];
	if(user != null && currentRoom != '')
	{
		window.userState = "leaving" 
		console.log('Leaving...')
		window.ws.send(JSON.stringify({event: 'leaving', room: currentRoom, user: user}))
	}
	
	var href = location.href.split( '/' );
	href[3] = action !== '' ? encodeURIComponent(document.getElementById(`room-value-${action}`).value) : encodeURIComponent(room);
	window.location.href = href.join('/');
}

reJoinRoom = () =>
{
	let room = location.href.split( '/' )[3];
	let user = sessionStorage.getItem('name');
	//console.log(`Room: ${room}, User: ${user}`)
	if(user != null && room != '')
	{
		console.log('Joining...')
		window.ws.send(JSON.stringify({event: 'joining', room: room, user: user}))
	}
	var count = document.getElementById(`${room}-list-count`);
	if (count !== undefined)
	{
		count.innerHTML = parseInt(count.innerHTML) + 1
	}
}

leaveRoom = () => {
	let room = location.href.split( '/' )[3];
	let user = sessionStorage.getItem('name');
	//console.log(`Room: ${room}, User: ${user}`)
	if(user != null && room != '')
	{
		console.log('Leaving...')
		window.ws.send(JSON.stringify({event: 'leaving', room: room, user: user}))
	}
}
	
setName = () =>{
	leaveRoom();
	sessionStorage.setItem('name', document.getElementById('name-value').value);
	setTimeout(() => {
		reJoinRoom();
	}, 1000);
}

joinedRoom = (data) =>
{
	var ul = document.getElementById("user-list");
	
	if (data.room == decodeURIComponent(location.href.split( '/' )[3]))
	data.users.forEach((user) => {
		if(user)
		{
			user = user.replace(/ /g, "-")
			let check = document.querySelector(`.${user}-list-name`);
			if (check === null)
			{
				var li = document.createElement("li");
				li.classList.add(`${user}-list-name`);
				user = user.replace(/-/g, " ")  
				li.appendChild(document.createTextNode(`${user}`));
				ul.appendChild(li);
			}
		}
	})

	var count = document.getElementById(`${data.room}-list-count`);
	if (count !== null)
	{
		count.innerHTML = data.users.length	
	}
}

//NASTY
newRoom = (data) =>
{
	let currentRoom = location.href.split( '/' )[3];

	var listItem = document.getElementById(`${data.room}-list-item`)
	var button = document.querySelector(`#room-list button`)
	if (listItem === null)
	{
		var list = document.getElementById("room-list");
		var row = document.createElement("div");
		row.classList.add(`row`);
		row.classList.add(`room-list-item`)
		if(currentRoom == data.room) row.classList.add(`active-list`);
		
		row.id = `${data.room}-list-item`

		var col3_1 = document.createElement("div"); col3_1.classList.add(`col-3`);
		var img = document.createElement("img"); img.classList.add(`side-room-img`);
		img.src = `https://identicon-api.herokuapp.com/${encodeURI(data.room.replace(/\?/g, ""))}/32?format=png`
		col3_1.appendChild(img)
		
		var col6 = document.createElement("div"); col6.classList.add(`col-6`);
		var item = document.createElement("span");
		item.classList.add(`text-button`);
		item.innerHTML = data.room
		col6.appendChild(item);
		
		var col3_2 = document.createElement("div"); col3_2.classList.add(`col-3`);
		var span = document.createElement("span"); span.id = `${data.room}-list-count`;
		span.innerHTML = data.inRoom
		col3_2.appendChild(span)

		row.appendChild(col3_1);
		row.appendChild(col6);
		row.appendChild(col3_2);
		row.onclick = function() { joinRoom('', data.room); }
		list.insertBefore(row, button);
		//list.insertBefore(row, list[list.length - 3]);
	}
	joinedRoom(data)
}

leftRoom = (data) =>
{

	var ul = document.getElementById("user-list");
	var li = document.querySelector(`.${data.user}-list-name`);
	var count = document.getElementById(`${data.room}-list-count`);
	if (li !== null)
	{
		removeNodeFromList(li);
	}
	if (count !== null)
	{
		count.innerHTML = data.inRoom
	}
}

removedRoom = (data) =>
{
	var listItem = document.getElementById(`${data.room}-list-item`);
	if (listItem !== null)
	{
		removeNodeFromList(listItem);
	}
}

pickALoser = () =>
{
	axios.post(`/${location.href.split( '/' )[3]}`, {})
	  .then(function (response) {
		  //console.log(response);
	  })
	  .catch(function (error) {
		console.log(error);
	  });
}

announceLoser = (data) =>
{
	document.getElementById('loser-text').innerHTML = data.user + "!"
	$("#loser").modal()
}

window.addEventListener("beforeunload", function (e) {
	if (window.userState != "leaving")
	{
		leaveRoom();
	} 
});