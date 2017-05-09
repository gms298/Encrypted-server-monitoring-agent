var io = require('socket.io-client');
var socket = io.connect('http://0.0.0.0:47874');

var results;

// Toggle FULL(1)/COMPACT(2) mode
var toggle = 1;

socket.on('heartbeat', function(data) {
  //console.log(data);
  if(toggle == 1) {
    // FULL MODE
    console.log(data);
  }
  else {
    // COMPACT MODE
    results = {
        Server: data.Name,
        CPU: {
            Utilization: {
                Total: data.CPU.Utilization.Total
            }
        },
        Memory: {
            UsedPercent: data.Memory.UsedPercent,
            AvailablePercent: data.Memory.AvailablePercent
        },
        Disk: {
            Used: data.Disk.Used,
            Total_sec: data.Disk.Total_sec
        },
        Network: {
            Down_sec: data.Network.Down_sec,
            Up_sec: data.Network.Up_sec
        }
    }
    console.log(results);
  }
});

