$(document).ready(function() {
	Game.init(World, 0, 2);
	clear();
	
	$("#execute").click(function() {
		Game.executeUserCommand();
	});
	
	$("#clear").click(function() {
		clear();
	});
	
	function clear() {
		Game.clearMessages()
			.showUserCurrentLocation()
			.showUserCurrentPosition()
			.showPossibleActions();
	} 
});