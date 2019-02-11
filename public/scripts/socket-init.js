function start()
{
	var pathArray = location.href.split( '/' );
	var host = pathArray[2];
	if(pathArray[3] != "")
	{
		var room = pathArray[3]
	}
	console.log("Reconnecting...")
	
	if (location.protocol === 'https:') {
    	window.ws = new WebSocket('wss://' + host);
	}
	else
		window.ws = new WebSocket('ws://' + host);

	window.ws.onmessage = function (ev) 
	{	
		//console.log(JSON.parse(ev.data))
		try {
			let msg = JSON.parse(ev.data);
			let s = `${msg.event}`;
			window[s](msg.data);
		} catch (e) {console.log(e)}
	}

	window.ws.addEventListener('open', function (event) 
	{
		let user = sessionStorage.getItem('name')
		if(room != undefined && user != null) 
		{	
			window.ws.send(JSON.stringify({event: 'joining', room: room, user: user}))
			document.getElementById("name-value").placeholder = user; 
		}
		console.log("Connected")
	})

	

	window.ws.onclose = function(){
	    // Try to reconnect in 5 seconds
	    
	    setTimeout(function(){start()}, 5000);
	};
}

window.onload = start();
