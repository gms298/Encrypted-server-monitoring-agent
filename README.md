# Monitoring-using-Socket.IO

## Description

A continuous server monitoring application written in node.JS using Socket.IO npm module. End-to-End Encryption is used to protect the data in transit using unique **8192 bit RSA keys and SHA256 signatures**. The metrics collected are output as a JSON. Hence, integration with other applications (like this [Monitor-bot](https://github.com/gms298/Monitor-bot) that I built) is easy.

The application collects the following metrics:

* CPU
	* Type
	* Utilization (System/User/Total)
* Physical Memory
	* Utilization (Total/Free/Used/Active/Available plus Use % and Available %)
* Disk
	* Usage (in %)
	* Read & Write speed per second
* Network
	* Current Download speed
	* Current Upload speed
	* Total downloaded and uploaded bytes (from system boot)

The application can be run in two modes, from the client side:

* **FULL**: Prints all server information collected in JSON format.
* **COMPACT**: Prints only CPU, Memory, Disk and Network Utilizaton in JSON format.

## Execution

### Server-side

Clone this repository and change directories.

* Make a new folder named `server` and then run the commands below in Terminal on Ubuntu/Linux/macOS.

* Generate the 8192 bit RSA keys using,

	`openssl genrsa -out privatekey.pem 8192` to generate the private key
	
	`openssl rsa -in privatekey.pem -pubout -out publickey.pem` to generate the public key.

* Copy the `publickey.pem` file to the client-side - usign the same directory structure i.e., create `server` folder and paste inside.

* Change directories again 1 level up where package.json is located. Run `npm install` to automatically install all dependencies required by this project.

* Modify the [server.js](https://github.com/gms298/Monitoring-Analysis-using-Socket.IO/blob/master/server.js#L7) source code to reflect the actual port number to run this monitoring server on.

* The server has a predefined whitelist IP address to accept incoming connections. Change [this IP address](https://github.com/gms298/Monitoring-Analysis-using-Socket.IO/blob/master/server.js#L60) to reflect the actual client's IP address. 

* Run the server using [forever](https://www.npmjs.com/package/forever) `forever start server.js`

### Client-side

Clone this repository and change directories.

* Make a new folder named `client` and then run the commands below in Terminal on Ubuntu/Linux/macOS.

* Generate the 8192 bit RSA keys using,

	`openssl genrsa -out privatekey.pem 8192` to generate the private key
	
	`openssl rsa -in privatekey.pem -pubout -out publickey.pem` to generate the public key.

* Copy the `publickey.pem` file to the server-side - usign the same directory structure i.e., create `client` folder and paste inside.

* Change directories again 1 level up where package.json is located. Run `npm install` to automatically install all dependencies required by this project.

* Modify the [client.js](https://github.com/gms298/Monitoring-Analysis-using-Socket.IO/blob/master/client.js#L8) source code to reflect the actual IP address & port number of the server to connect.

* Run the client using `nodejs client.js` or `node client.js` (for legacy node.JS)