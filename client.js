var io = require('socket.io-client');

var socket = io.connect('http://0.0.0.0:47873');
var startTime;
var results;

// setInterval(function() {
//   startTime = Date.now();
//   socket.emit('pinging');
//   console.log("Ping")
// }, 2000);

// socket.on('pong', function() {
//   var latency = Date.now() - startTime;
//   console.log("Latency is",latency);
// });

socket.on('heartbeat', function(data) {
  //console.log(data);
  results = {
      Server: data.name,
      CPU: {
          System: data.cpu.currentload_system.toFixed(2),
          User: data.cpu.currentload_user.toFixed(2),
          Total: data.cpu.currentload.toFixed(2)
      },
      Memory: {
          Total: data.memoryLoad.total,
          Free: data.memoryLoad.free,
          Used: data.memoryLoad.used,
          Active: data.memoryLoad.active,
          Available: data.memoryLoad.available,
          BufferedCache: data.memoryLoad.buffcache,
          UsedPercent: usedPercent(data.memoryLoad.total, data.memoryLoad.available),
          AvailablePercent: availPercent(data.memoryLoad.total, data.memoryLoad.available)
      }
  }
  console.log(results);
});

// Helper functions
function usedPercent(total, available) {
    var to_return = ((total-available)/total)*100;
    return to_return.toFixed(2);
}

function availPercent(total, available) {
    var to_return = (available/total)*100;
    return to_return.toFixed(2);
}