var io = require('socket.io-client');
var socket = io.connect(''); // SERVER IP 

var results;

// Toggle FULL(1)/COMPACT(2) mode
var args = process.argv.slice(2);

if(args.length == 0) {
    console.log("No mode specified! Default to Full mode...");
    var toggle = 1;
}
if (args[0]=='FULL') {
    var toggle = 1;
} 
else if(args[0]=='COMPACT') {
    var toggle = 2;
}
else {
    console.log("Invalid mode specified! Default to Full mode ...");
    var toggle = 1;
}

// Socket to receive emmitted events
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
            Utilization: data.CPU.Utilization.Total
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

