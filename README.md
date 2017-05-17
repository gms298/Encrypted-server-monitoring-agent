# Server Monitoring Agent

## Description

A continuous server monitoring agent that is lightweight and fully encrypted written in node.JS using Socket.IO npm module. End-to-End Encryption is used to protect the data in transit using **Asymmetric RSA encryption and SHA256 signatures**. 

The server agent outputs metrics in JSON format. The agent was built with compatibility in mind. Hence, integration with other suite of applications is pretty straightforward.

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

* Modify the [server.js](https://github.com/gms298/Encrypted-server-monitoring-agent/blob/master/client.js#L8) source code to reflect the actual port number to run this monitoring server on.

* The server has a predefined whitelist of IP addresses to accept incoming connections. Add the actual client's IP address [to this list](https://github.com/gms298/Encrypted-server-monitoring-agent/blob/master/server.js#L18). 

* Run the server using [forever](https://www.npmjs.com/package/forever) `forever start server.js`

### Client-side

Clone this repository and change directories.

* Make a new folder named `client` and then run the commands below in Terminal on Ubuntu/Linux/macOS.

* Generate the 8192 bit RSA keys using,

	`openssl genrsa -out privatekey.pem 8192` to generate the private key
	
	`openssl rsa -in privatekey.pem -pubout -out publickey.pem` to generate the public key.

* Copy the `publickey.pem` file to the server-side - usign the same directory structure i.e., create `client` folder and paste inside.

* Change directories again 1 level up where package.json is located. Run `npm install` to automatically install all dependencies required by this project.

* Modify the [client.js](https://github.com/gms298/Encrypted-server-monitoring-agent/blob/master/client.js#L8) source code to reflect the actual IP address & port number of the server to connect.

* Run the client using `nodejs client.js` or `node client.js` (for legacy node.JS)