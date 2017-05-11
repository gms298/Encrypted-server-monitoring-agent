# Monitoring-using-Socket.IO

## Description

A continuous server monitoring application written in node.JS using Socket.IO npm module. End-to-End Encryption is used to protect the data in transit using unique **8192 bit RSA keys and SHA256 signatures**. The metrics collected are output as a JSON. Hence, integration with other applications (like this [Monitor-bot]() that I built) is easy.

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

### Client-side