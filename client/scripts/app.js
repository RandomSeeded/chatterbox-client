
// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox'
app.friends = {};
app.username = 'KC';
app.lobby;
app.lobbies = {};
app.messages = [];
app.lastUpdate;

app.init = function() {
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    success: function (data) {
      console.log('chatterbox: fetch success');
      app.messages = data.results;
      app.displayMessages();
      app.lastUpdate = Date.parse(app.messages[0].createdAt);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: fetch failed');
    }
  });  
}

app.displayMessages = function() {
  app.messages.forEach(function(message) {
    if((Date.parse(message.createdAt) > app.lastUpdate) || app.lastUpdate === undefined) {
      if (message.roomname === app.lobby || app.lobby === undefined) {
        app.addMessage(message);
      }
      if (message.roomname && app.lobbies[message.roomname] === undefined) { 
        app.lobbies[message.roomname] = true;
        var option = $('<option></option>');
        option.text(message.roomname);
        $('#roomSelect').append(option);
      }
    }
  });
}

app.fetch();
setInterval(app.fetch, 5000);

app.clearMessages = function() {
  $("#chats").empty();
}

app.addMessage = function(message) {
  var groupDiv = $('<div></div>');

  var messageDiv = $('<span></span>');
  messageDiv.text(message.text);

  var nameDiv = $('<span></span>');
  nameDiv.text(message.username+": ");
  nameDiv.addClass("username");
  nameDiv.on('click', function() {
    app.addFriend(message.username);
  });

  groupDiv.append(nameDiv);
  groupDiv.append(messageDiv);
  $("#chats").prepend(groupDiv);
}

app.addRoom = function(room) {
  var div = $('<div></div>');
  div.text(room);
  $("#roomSelect").append(div);
}
                                                                                 
app.addFriend = function(friend) {
  this.friends[friend] = friend;
}

app.handleSubmit = function(message) {
  // 1) send it off to the server
  this.send(message);
  // 2) add it to our messages
  // this.addMessage(message);
  app.fetch();
}

// we're going to want to populate the dropdown based on our fetch results
app.setLobby = function(lobby) {
  $("#chats").empty();
  for (var i = 0; i < app.messages.length; i++) {
    if (app.messages[i].roomname === lobby) {
      app.addMessage(app.messages[i]);
    }
  }
  app.lobby = lobby;
}


$(document).ready(function() {
  $('#send .submit').submit(function(event) {
    event.preventDefault();
    var message = {
      username: $('#handle').val(),
      text: $('#message').val(),
      roomname: app.lobby
    }
    app.handleSubmit(message);
    $('#message').val('');
  });

  $('#roomSelect').on('change', function(event) {
    app.setLobby($('option:selected').text());
  });
})