// Websocket Server that website connects to.
var io = require('socket.io')(47874);
var si = require('systeminformation');
var cpu_util = 0.0;
var mem_util;
var cpu_temp;
var cpu_type;

// Gather performance data every 500 ms throughout the lifetime
setInterval(function() {
    // CPU type, load & temperature
    si.cpu(function(data) {
        cpu_type = data;
    });

    si.currentLoad(function(data) {
        cpu_util = data;
    });

    si.cpuTemperature(function(data) {
        cpu_temp = data;
    });

    // Memory utilization
    si.mem(function(data) {
        mem_util = data;
    });

}, 750);

// Upon successful connection, emit socket events every 3s
io.on('connection', function (socket) {
	console.log("Received connection");

	var heartbeatTimer = setInterval( function ()
	{            
		var data = {
			name: "manojsharan.me", 
            cpu: {
                type: cpu_type,
                util: cpu_util,
                temp: cpu_temp
            },
            memory: mem_util
		};
		console.log("Emitting Socket event",data)
		socket.emit("heartbeat", data);
	}, 1000);

	socket.on('disconnect', function () {
		console.log("closing connection")
    	clearInterval(heartbeatTimer);
  	});
});
