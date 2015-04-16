function InputManager(){
	//Mouse
		var mouseX;
		var mouseY;
	//Apuis
		this.downAction = false;
	//Arrow key codes
		this.UP = 38;
		this.DOWN = 40;
		this.RIGHT = 39;
		this.LEFT = 37;
		
	//Enter
		this.ENTER = 13;
	//Space
		this.SPACE = 32;

	//Directions
		this.up = false;
		this.down = false;
		this.right = false;
		this.left = false;
		
	//Buttons
		this.downEnter = false;
		this.downSpace = false;
		
	
	//Button
		this.buttons = [];


}

InputManager.prototype.keyDown = function(event){
	
		 this.downAction = true;
		 switch(event.keyCode){
			case this.UP:
				this.up = true;
				break;
	  
			case this.DOWN:
				this.down = true;
				break;
	    
			case this.LEFT:
				this.left = true;
				break;  
	    
			case this.RIGHT:
				this.right = true;
				break; 
				
			case this.ENTER:
				this.downEnter = true;
				break;
				
			case this.SPACE:
				this.downSpace = true;
				break;	
		}
		
	
}
	
InputManager.prototype.keyUp = function(event){
	
	this.downAction = false;
	switch(event.keyCode){
		
		case this.UP:
			this.up = false;
			break;
	  
		case this.DOWN:
			this.down = false;
			break;
	    
		case this.LEFT:
			this.left = false;
			break;  
	    
		case this.RIGHT:
			this.right = false;
			break; 
		
		case this.ENTER:
			this.downEnter = false;
			break;
			
		case this.SPACE:
			this.downSpace = false;
			break;		
  }

	 
}

InputManager.prototype.checkPos = function(mouseEvent){
	 mouseX = mouseEvent.pageX - this.offsetLeft;
	 mouseY = mouseEvent.pageY - this.offsetTop;
	 
	 
}





