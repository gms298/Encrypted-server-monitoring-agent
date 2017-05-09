var io = require('socket.io-client');
var socket = io.connect('http://0.0.0.0:47874');

var results;

// Toggle FULL(1)/COMPACT(2) mode
var toggle = 1;

socket.on('heartbeat', function(data) {
  //console.log(data);
  if(toggle == 1) {
    // FULL MODE
    results = {
        Server: data.name,
        CPU: {
            Type: {
                Manufacturer: data.cpu.type.manufacturer,
                Brand: data.cpu.type.brand,
                Speed: data.cpu.type.speed,
                Cores: data.cpu.type.cores
            },
            Utilization: {
                System: data.cpu.util.currentload_system.toFixed(2),
                User: data.cpu.util.currentload_user.toFixed(2),
                Total: data.cpu.util.currentload.toFixed(2)
            },
            Temperature: {
                Main: data.cpu.temp.main,
                Max: data.cpu.temp.max
            }
        },
        Memory: {
            Total: data.memory.total,
            Free: data.memory.free,
            Used: data.memory.used,
            Active: data.memory.active,
            Available: data.memory.available,
            BufferedCache: data.memory.buffcache,
            UsedPercent: usedPercent(data.memory.total, data.memory.available),
            AvailablePercent: availPercent(data.memory.total, data.memory.available)
        },
        Disk: {
            Used: data.filesystem.fsSize[0].use,
            Read_sec: parseInt(data.filesystem.fsStats.rx_sec),
            Write_sec: parseInt(data.filesystem.fsStats.wx_sec),
            Total_sec: parseInt(data.filesystem.fsStats.tx_sec)
        },
        Network: {
            Down_sec: parseInt(data.network.rx_sec),
            Up_sec: parseInt(data.network.tx_sec),
            Total_downloaded: data.network.rx,
            Total_uploaded: data.network.tx
        }
    }
    console.log(results);
  }
  else {
        // COMPACT MODE
        results = {
            Server: data.name,
            CPU: {
                Utilization: {
                    Total: data.cpu.util.currentload.toFixed(2)
                }
            },
            Memory: {
                UsedPercent: usedPercent(data.memory.total, data.memory.available),
                AvailablePercent: availPercent(data.memory.total, data.memory.available)
            },
            Disk: {
                Used: data.filesystem.fsSize[0].use,
                Total_sec: parseInt(data.filesystem.fsStats.tx_sec)
            },
            Network: {
                Down_sec: parseInt(data.network.rx_sec),
                Up_sec: parseInt(data.network.tx_sec)
            }
        }
        console.log(results);
    }
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