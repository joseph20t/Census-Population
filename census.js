const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Types', 'text/html');
})

server.listen(3100, () => {
    console.log("server listening on port 3100")
})