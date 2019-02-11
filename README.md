# Who-Loses

Who loses is an interact website that allows users to create and join rooms and pick a random loser from the people currently in the room.

A fun little project that is the result of experimenting with Web Sockets.

Stack consits of Node.js using the Express.js framework hosted on [Ziet's Now](https://zeit.co/now) service.

Website is live at [who-loses.com](https://who-loses.com/)

On connection to the website the browser tries to connect to the websocket server running on the same Node.js server. Users can create or join rooms using the side bar and pick a loser when in a room.

The 'magic' behind the scenes is that when users create or join rooms it fires off an event that will broadcast this action to the rest of the connected clients using the Websocket API. The UI is automatically updated without the other users having to refresh the page. 

When somebody clicks on the "Pick a Loser" button in a room a random user that is currently in that room is chosen and annonced to everyone else in that room.

If no one else if using the site, open up another tab in your web browser and enjoy who-loses.com by yourself!

Elements of the UI that get updated include:
* Sidebar room list names
* Sidebar number of users in a room
* 'In Room Now' names
* Modal announcing the rooms loser.

Popular room names include:
* Who is walking the dog?
* Who is taking out the bins tonight?
* Who has to wash the dishes?

