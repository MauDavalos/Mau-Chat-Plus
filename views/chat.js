var socket = io.connect('http://localhost:8080');

var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');
      notificacion = document.getElementById('notificacion');

btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";

    socket.emit('notificacion', {
        handle: handle.value,

        notificacion: notificacion.value
    });

    socket.emit('desencriptar', {
        message: message.value
       
    });
     
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})

socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('desencriptar', function(data){
    feedback.innerHTML = '';
    output.innerHTML += ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' está escribiendo un mensaje...</em></p>';
});

socket.on('notificacion', function(data){
    notificacion.innerHTML = '<p><em>' + data.handle + '  ha enviado un mensaje...</em></p>';
});