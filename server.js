'use strict';
// Encryption using URSA npm module
var fs = require('fs');
var ursa = require('ursa');
var _ = require('underscore');

// Websocket Server that website connects to.
var io = require('socket.io')(8765);
var si = require('systeminformation');

// Other variable objects
var cpu_util = 0.0;
var mem_util, cpu_type, fsSize, fsStats, netStats, transmitted_JSON;
var msg, sig, enc, SERVER_NAME, WHITELIST;

// Set Server Name and Whitelist
SERVER_NAME = "MYSERVER"
WHITELIST = ["127.0.0.1", "0.0.0.0"]

// Import keys used in encryption and signature computation
var privkeyServer = ursa.createPrivateKey(fs.readFileSync('./client/privatekey.pem'));
var pubkeyClient = ursa.createPublicKey(fs.readFileSync('./client/publickey.pem'));

// Gather performance data every 500 ms throughout the lifetime
setInterval(function() {
    // CPU type, load & temperature
    si.cpu(function(data) {
        cpu_type = data;
    });

    si.currentLoad(function(data) {
        cpu_util = data;
    });

    // Memory utilization
    si.mem(function(data) {
        mem_util = data;
    });

    // Disk Statistics
    si.fsSize(function(data) {
        fsSize = data;
    });

    si.fsStats(function(data) {
        fsStats = data;
    });

    // Network Statistics
    si.networkStats('en0', function(data) {
        netStats = data;
    });

}, 500);

// Upon successful connection, emit socket events every 3s
io.on('connection', function (socket) {
    // Get the IP address
    var clientIp = socket.request.connection.remoteAddress;
    clientIp=clientIp.toString();
    var realIP = clientIp.split('f:')[1];
    console.log("Received connection from "+realIP);

    // Check if client's IP is whitelisted
    if(_.contains(WHITELIST, realIP)) {
        //Whitelisted, proceed to communication
        var heartbeatTimer = setInterval(function () {
            var results = {
                CPU: {
                    Type: {
                        Manufacturer: cpu_type.manufacturer,
                        Brand: cpu_type.brand,
                        Speed: cpu_type.speed,
                        Cores: cpu_type.cores
                    },
                    Utilization: {
                        System: cpu_util.currentload_system.toFixed(2),
                        User: cpu_util.currentload_user.toFixed(2),
                        Total: cpu_util.currentload.toFixed(2)
                    }
                },
                Memory: {
                    Total: mem_util.total,
                    Free: mem_util.free,
                    Used: mem_util.used,
                    Active: mem_util.active,
                    Available: mem_util.available,
                    BufferedCache: mem_util.buffcache,
                    UsedPercent: usedPercent(mem_util.total, mem_util.available),
                    AvailablePercent: availPercent(mem_util.total, mem_util.available)
                },
                Disk: {
                    Used: fsSize[0].use,
                    Read_sec: parseInt(fsStats.rx_sec),
                    Write_sec: parseInt(fsStats.wx_sec),
                    Total_sec: parseInt(fsStats.tx_sec)
                },
                Network: {
                    Down_sec: parseInt(netStats.rx_sec),
                    Up_sec: parseInt(netStats.tx_sec),
                    Total_downloaded: netStats.rx,
                    Total_uploaded: netStats.tx
                }
            }

            // Encrypt the results JSON object and add signature
            msg = JSON.stringify(results);

            // Encryption
            enc = pubkeyClient.encrypt(msg, 'utf8', 'base64');
            sig = privkeyServer.hashAndSign('sha256', enc, 'utf8', 'base64');

            // Print encrypted text and signature

            //console.log('Encrypted message: ', enc, '\n');
            //console.log('Signature after encryption: ', sig, '\n');

            // Make a JSON with encrypted contents and signature - to transmit over the Internet
            transmitted_JSON = {
                                name: SERVER_NAME,
                                enc: enc,
                                sig: sig
                                };

            // Emit a socket.io event  
            console.log("Emitting Socket event");
            socket.emit("heartbeat", transmitted_JSON);
        }, 1100);
    }
    else {
        // Blacklisted, drop socket
        socket.disconnect(0);
    }

    socket.on('disconnect', function() {
        // handle disconnect
        console.log("DISCONNECTING")
        clearInterval(heartbeatTimer);
        socket.disconnect();
    });
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
