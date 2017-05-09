// Websocket Server that website connects to.
var io = require('socket.io')(47873);
var si = require('systeminformation');
var cpu_util = 0.0;
var mem_util;

// Gather performance data every 500 ms throughout the lifetime
setInterval(function() {
    si.currentLoad(function(data) {
            //cpu_util = data.currentload;
            cpu_util = data;
            //console.log("CPU:",cpu_util.toFixed(2))
        });

    si.mem(function(data) {
        //mem_util = ( data.available / data.total ) * 100;
        mem_util = data;
        //console.log("Memory:",mem_util.toFixed(2))
    });
}, 750);

// Upon successful connection, emit socket events every 3s
io.on('connection', function (socket) {
	console.log("Received connection");

	var heartbeatTimer = setInterval( function ()
	{            
		var data = {
			name: "manojsharan.me", 
            //cpu: cpu_util.toFixed(2),
            cpu: cpu_util,
            //memoryLoad: mem_util.toFixed(2)
            memoryLoad: mem_util
		};
		console.log("Emitting Socket event")
		//io.sockets.emit('heartbeat', data );
		socket.emit("heartbeat", data);
	}, 1000);

	socket.on('disconnect', function () {
		console.log("closing connection")
    	clearInterval(heartbeatTimer);
  	});

// // Ping pong
//   socket.on('pinging', function() {
//       console.log("Pong")
//     socket.emit('pong');
//   });
});
