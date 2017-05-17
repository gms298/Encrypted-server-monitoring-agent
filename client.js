'use strict';
// Encryption using URSA npm module
var fs = require('fs');
var ursa = require('ursa');

// Websocket Client
var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:8765'); // Server's IP address and port number (Eg., `http://test.com:8765`)

// Other variable objects
var results;
var rcv, data, network_JSON;

// Import keys used in decryption and signature computation
var privkeyClient = ursa.createPrivateKey(fs.readFileSync('./client/privatekey.pem'));
var pubkeyServer = ursa.createPublicKey(fs.readFileSync('./server/publickey.pem'));

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
socket.on('heartbeat', function(network_JSON) {
    // Signature verification
    var enc = new Buffer(network_JSON.enc).toString('base64');

    if (!pubkeyServer.hashAndVerify('sha256', enc, network_JSON.sig, 'base64')) {
        throw new Error("Invalid signature, discarding packet..");
    }
    else {
        // Valid signature, proceed to decrypting
        rcv = privkeyClient.decrypt(network_JSON.enc, 'base64', 'utf8');
        data = JSON.parse(rcv);
        
        // Print the decrypted message
        if(toggle == 1) {
            // FULL MODE
            console.log("\n"+network_JSON.name+"\n");
            console.log(data);
        }
        else {
            // COMPACT MODE
            results = {
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
            console.log("\n"+network_JSON.name+"\n");
            console.log(results);
        }
    }
});

