const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
let users = [];
let userNames = [];
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

io.on('connection', (socket) => {
	
	socket.on('connect', (val) => console.log(val))
	let id = users.length;
	users.push(id);
	socket.emit('handshake',{id});
	socket.emit('introduce');
	socket.on('iam', (res) => {
		userNames[res.id] = res.name;
		io.emit('playerCheck');
		users = [];
		userNames = [];
		io.emit('newPlayer',{people: userNames});
	})

	socket.on('playerCheckResponse', data => {
		users.push(data.id)
		userNames.push(data.name)
		io.emit('newPlayer',{people: userNames});
	})
	


	socket.on('roll', (req, res) => {
		io.emit('newRoll',{id: req.id, name: userNames[req.id], dice: req.dice, value: Math.floor((Math.random()) * Math.floor(req.dice))+1 })
	})
});

http.listen(3000, () => console.log('listening on 3000'));
