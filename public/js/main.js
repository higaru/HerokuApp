(function () {

	Game = {};
	
	Game.socket = io.connect('http://192.168.1.17:3000');

	var stats = new Stats();
	stats.setMode(1); // 0: fps, 1: ms

	document.body.appendChild( stats.domElement );

    function init()
    {
    	//TIME
  		Game.tNow = window.performance.now();
  		Game.fps = 60;
  		Game.interval = 1000/ Game.fps;
  		Game.delta = 0;
  		Game.lateTime = 0;
  		Game.shouldRepaint = true;

  		//CANVAS
  		Game.canvas = document.createElement('canvas');
  		document.body.appendChild(Game.canvas);
  		Game.canvas.width = 640;
    	Game.canvas.height = 480;
    	Game.ctx = Game.canvas.getContext("2d");

      //GAME
      var startX = Math.round(Math.random()*(Game.canvas.width-5)),
          startY = Math.round(Math.random()*(Game.canvas.height-5));
      Game.localPlayer = new Player(startX, startY);
      Game.remotePlayers = [];
      Game.inputManager = new InputManager();
      //SOCKETS
      setEventHandlers();

  	  update();
	  } 

  	function update(tFrame) 
  	{
    	Game.stopMain = window.requestAnimationFrame( update );
    	// Calculate the delta between the previous timestamp and the new one
    	Game.delta = tFrame - Game.lateTime;
    	// Your main loop contents.
    	if (Game.delta > Game.interval && Game.shouldRepaint) 
      {
    		stats.begin();
        if(Game.inputManager.downAction)
        {
          // Send local player data to the game server
          Game.socket.emit("move player", {x: Game.localPlayer.getX(), y: Game.localPlayer.getY()});
        }
        updatePlayer();
        render();
			  stats.end();
		  }
  	}

  	function render()
  	{	
  		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

      // Draw the local player
      Game.localPlayer.draw(Game.ctx);
      Game.ctx.font="20px Georgia";
      Game.ctx.fillText("Players : " + (Game.remotePlayers.length + 1),Game.canvas.width/2,15);
      // Draw the remote players
      var i;
      for (i = 0; i < Game.remotePlayers.length; i++) {
        Game.remotePlayers[i].draw(Game.ctx);
      };
  	}

    var setEventHandlers = function() 
    { 
      window.addEventListener("keydown", function(event){
        Game.inputManager.keyDown(event);
      }, false);
  
      window.addEventListener("keyup", function(event){
        Game.inputManager.keyUp(event);
      }, false);
      
      // Socket connection successful
      Game.socket.on("connect", onSocketConnected);
      // New player message received
      Game.socket.on("new player", onNewPlayer);
      // Player removed message received
      Game.socket.on("remove player", onRemovePlayer);
      // Player move message received
      Game.socket.on("move player", onMovePlayer);
    }

    var onSocketConnected = function(data)
    {
      console.log("Connected to socket server");

      Game.socket.emit("new player", {x: Game.localPlayer.getX(), y: Game.localPlayer.getY()});
    }

    function updatePlayer()
    {
      if(Game.inputManager.left)
      {
        var x = Game.localPlayer.getX();
        x = x - 2;
        Game.localPlayer.setX(x);
      }

      if(Game.inputManager.right)
      {
        var x = Game.localPlayer.getX();
        x = x + 2;
        Game.localPlayer.setX(x);
      }

      if(Game.inputManager.up)
      {
        var y = Game.localPlayer.getY();
        y = y - 2;
        Game.localPlayer.setY(y);
      }

      if(Game.inputManager.down)
      {
        var y = Game.localPlayer.getY();
        y = y + 2;
        Game.localPlayer.setY(y);
      }
    } 
    // New player
    function onNewPlayer(data) {
      console.log("New player connected: "+data.id);

      // Initialise the new player
      var newPlayer = new Player(data.x, data.y);
      newPlayer.id = data.id;

      // Add new player to the remote players array
      Game.remotePlayers.push(newPlayer);
      console.log(Game.remotePlayers);
    };

    // Remove player
    function onRemovePlayer(data) 
    {
      var removePlayer = playerById(data.id);

      // Player not found
      if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
      };

      // Remove player from array
      console.log("Player quit: "+data.id);
      Game.remotePlayers.splice(Game.remotePlayers.indexOf(removePlayer), 1);
    };

  // Move player
  function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

    // Player not found
    if (!movePlayer) {
      console.log("Player not found: "+data.id);
      return;
    };

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
  };

  // Find player by ID
  function playerById(id) 
  {

    var i;
    for (i = 0; i < Game.remotePlayers.length; i++) {
      if (Game.remotePlayers[i].id == id)
        return Game.remotePlayers[i];
    };
    
    return false;
  };
  	// Start the cycle
  	init();
  	//window.cancelAnimationFrame( MyGame.stopMain );
})();