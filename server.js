var http = require("http")
var ws = require("index.js")
var fs = require("fs")

http.createServer(function (req, res) {
	fs.createReadStream("index.html").pipe(res)
}).listen(process.env.OPENSHIFT_INTERNAL_PORT)

var server = ws.createServer(function (connection) {
	connection.nickname = null
	connection.on("text", function (str) {
		if (connection.nickname === null) {
			connection.nickname = str
			broadcast(str+" entered")
		} else
			broadcast("["+connection.nickname+"] "+str)
	})
	connection.on("close", function () {
		broadcast(connection.nickname+" left")
	})
})
server.listen(process.env.OPENSHIFT_INTERNAL_PORT + 1)

function broadcast(str) {
	server.connections.forEach(function (connection) {
		connection.sendText(str)
	})
}
