const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on("response-pts", (resState, coordinator, participantID) => {
        console.log(resState," response got");
        console.log("sending to ", coordinator);
        socket.to(coordinator).emit('response-stc', resState, participantID);
    })

    socket.on('request-cts', (coordinatorID) => {
        console.log("request recieved from ", coordinatorID);
        socket.broadcast.emit('request-stp', coordinatorID);
    })
});

// c -> coordinator
// s -> server
// p -> participants