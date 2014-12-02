var Game = {
	currentWorld: null,
	userCurrentLocationId: 0,
	userCurrentPostionId: 0,
	userCurrentLocation: null,
	userCurrentРosition: null,
	possibleActions: null,
	userBackpack: [],
	userBackpackMaxWeight: 5,
	
	init: function(world, locationId, positionId) {
		this.setCurrentWorld(world)
			.setUserCurrentLocation(locationId)
			.setUserCurrentPosition(positionId)
			.setPossibleActions()
			.clearMessages();
		
		return this;
	},
	
	getUserCommand: function() {
		return parseInt($("#command").val());
	},
	
	setUserCommand: function(command) {
		$("#command").val(command);
		
		return this;
	},
	
	executeDisable: function(disabled) {
		$("#execute, #command").prop("disabled", disabled);
		
		return this;
	},
	
	executeUserCommand: function(command) {
		command =  typeof command == "undefined" ? this.getUserCommand() : parseInt(command);
		
		if (!isNaN(command) && command < this.possibleActions.length) {
			
			this.executeDisable(true)
				.makeAction(command);

			if (this.possibleActions[command].action !== "changeUserLocation") {
				this.setPossibleActions()
					.showPossibleActions()
					.executeDisable(false);
			}
		}
		
		this.setUserCommand("");
		
		return this;
	},
	
	makeAction: function(actionIndex) {
		var action = this.possibleActions[actionIndex]
		
		this._unbindClick();
		this.actions[action.action].call(this, action.parameters);
		
		if (action.parameters.message !== null) {
			this.showInformationMessage(action.parameters.message);
		}
		
		return this;
	},
	
	showUserCurrentLocation: function() {
		this.showMessage("Вы находитесь в местности под названием " + this.userCurrentLocation.name);
		
		return this;
	},
	
	showUserCurrentPosition: function() {
		this.showMessage("Местоположение: " + this.userCurrentPosition.name);
		
		return this;	
	},
	
	showPossibleActions: function() {	
		var self = this;
		var parameters = {};
		
		this.showMessage("Вы можете:");	

		for (var i in this.possibleActions) {
			var action = self.possibleActions[i];
		
			(function(i) {
				parameters = {
					onClick: function() {
						self.executeUserCommand(i);
					}
				}
			})(i);
			
			if (action.action !== "changeUserLocation") {
				self.showMessage(i + " - <span class='action'>" + action.name + ": " +
				action.parameters.name + "</span>", parameters);
			} else {
				self.showMessage(i + " - <span class='action'>" + action.name[0] + ": " + 
				action.parameters.location.name + ", " + action.name[1] + ": " +
				action.parameters.position.name + "</span>", parameters);
			}
		}
		
		return this;
	},
	
	_unbindClick: function() {
		$("#messages").find(".message").map(function() {
			$(this).html($(this).text());
		});
		
		$("#messages").find("span.action").unbind("click");
		
		return this;
	},
	
	clearMessages: function() {
		$("#messages").html("");
		
		return this;
	},
	
	_getMessageObject: function(message) {
		return $("<div class='message'></div>").html(message);
	},
	
	showMessage: function(message, parameters) {
		var message = this._getMessageObject(message);
		
		if (parameters) {
			if (parameters.onClick) {
				message.find("span.action").click(function() {
					parameters.onClick.call($(this));
				});
			}
		
			if (parameters.addClass) {
				message.addClass(parameters.addClass);
			}
		
		}
		$("#messages").append(message).scrollTop($("#messages").prop("scrollHeight"));
		
		return this;
	},
	
	showWarningMessage: function(message) {
		this.showMessage(message, {addClass: "warning"});
		
		return this;
	},
	
	showInformationMessage: function(message) {
		this.showMessage(message, {addClass: "information"});
		
		return this;	
	},
	
	setUserCurrentLocation: function(locationId) {
		this.userCurrentLocationId = locationId;
		this.userCurrentLocation = this.currentWorld.locations[this.userCurrentLocationId];
		
		return this;
	},
	
	setCurrentWorld: function(world) {
		this.currentWorld = world;
		
		return this;
	},
	
	setUserCurrentPosition: function(positionId) {
		this.userCurrentPositionId = positionId;
		this.userCurrentPosition = this.userCurrentLocation.objects[this.userCurrentPositionId];
		
		return this;
	},
	
	setPossibleActions: function() {
		var actions = [];
		var current = this.userCurrentPosition;

		for (var i in current.connectedWith) {
			var connection = this.userCurrentLocation.objects[current.connectedWith[i]];
			var parameters =  {
				position: connection.id,
				name: connection.name,
				type: connection.type,
				message: typeof connection.message !== "undefined" ? connection.message : null
			};
			
			if (connection.type == "square"	||
				connection.type == "street"	||
				connection.type == "station") {
				actions.push ({
					action: "move",
					name: "перейти в положение",
					parameters:	parameters
				});
			} else if (connection.type == "house") {
				actions.push ({
					action: "move",
					name:	current.type == "door" ||
							current.type == "room" ? "выйти на улицу из" : "подойти к фасаду",
					parameters:	parameters
				});
			} else if (	connection.type == "door"	||
						connection.type == "floor"	||
						connection.type == "flat"	||
						connection.type == "room") {
				parameters.canComeIn = connection.isOpen;
				
				actions.push({
					action: "comein",
					name:	connection.type == "floor" ? "перейти на" :
						 	current.type == "box" ||
						 	current.type == "man" ? "просматривать дальше" : "зайти в",
					parameters: parameters
				});
			}
		}
		
		if (current.contains) {
			for (var j in current.contains) {
				var connection = this.userCurrentLocation.objects[current.contains[j]];
				var parameters =  {
					position: connection.id,
					name: connection.name,
					type: connection.type,
					canOpen: connection.isOpen,
					message: typeof connection.message !== "undefined" ? connection.message : null,
				};
				
				if (connection.type == "box") {
					actions.push({
						action: "open",
						name: "открыть",
						parameters: parameters
					});
				} else if ((connection.type == "key" ||
							connection.type == "object") &&
							connection.accessed) {
					parameters.weight = connection.weight;
					
					actions.push({
						action: "get",
						name: "взять",
						parameters: parameters
					});
				} else if (connection.type == "man") {
					actions.push({
						action: "talk",
						name: "поговорить с",
						parameters: parameters
					});
				}

			}
		}
		
		if (current.connectedLocations) {
			for (var k in current.connectedLocations) {
				var location = this.currentWorld.locations[current.connectedLocations[k][0]];
				var position = location.objects[current.connectedLocations[k][1]];
				var parameters = {
					location: {
						id: location.locationId,
						name: location.name
					},
					position: {
						id: position.id,
						name: position.name
					}
				}
				
				actions.push({
					action: "changeUserLocation",
					name: ["переместиться в", "на"],
					parameters: parameters
				});
			}
		}
		
		this.possibleActions = actions;
		
		return this;
	},
	
	userHasObjectInBackpack: function(checkedObject) {
		for (var i in this.userBackpack) {
			if (this.userBackpack[i].locationId == checkedObject.locationId &&
				this.userBackpack[i].id == checkedObject.id) {
				return true;
			}
		}
		
		return false;
	},
	
	actions: {
		move: function(parameters) {
			this.setUserCurrentPosition(parameters.position);
			this.showUserCurrentPosition();
		},
		
		comein: function(parameters) {
			if (parameters.canComeIn) {
				this.setUserCurrentPosition(parameters.position);
			} else {
				this.showWarningMessage("Закрыто! Вы не можете пройти!");
			}
			
			this.showUserCurrentPosition();
		},
		
		open: function(parameters) {
			console.log(this.currentUserLocation);
			var canOpen = parameters.canOpen;
			var toOpenNeedObject = this.userCurrentLocation.objects[parameters.position]
									   .toOpenNeedObject;
			var showNeededObjectName = false;
			
			if (!canOpen && toOpenNeedObject) {
				if (this.userHasObjectInBackpack(toOpenNeedObject)) {
					canOpen = true;
				} else {
					showNeededObjectName = true;
				}
			}
			
			if (canOpen) {
				this.setUserCurrentPosition(parameters.position);
			} else {
				this.showWarningMessage("Закрыто...");
				this.showInformationMessage(
					"Чтобы открыть нужен: " + 
					this.currentWorld.locations[toOpenNeedObject.locationId]
									 .objects[toOpenNeedObject.id].name
				);
			}
		},
		
		talk: function(parameters) {
			this.setUserCurrentPosition(parameters.position);
		},
		
		get: function(parameters) {
			var backpackObjectsWeight = 0;
			
			for (var i in this.userBackpack) {
				backpackObjectsWeight += this.userBackpack[i].weight;
			}
			
			if (backpackObjectsWeight + parameters.weight <= this.userBackpackMaxWeight) {
				this.userBackpack.push({
					locationId: this.userCurrentLocationId,
					id: parameters.position,
					weight: parameters.weight
				});

				this.userCurrentLocation.objects[parameters.position].accessed = false;
			}
		},
		
		changeUserLocation: function(parameters) {
			var self = this;
			var action = function() {
				self.setUserCurrentLocation(parameters.location.id)
					.setUserCurrentPosition(parameters.position.id)
					.showUserCurrentLocation()
					.setPossibleActions()
					.showPossibleActions()
					.executeDisable(false);
			}
			
			this.showInformationMessage("Подождите 5 секунд...");
			setTimeout(action, 5000);
		}		
	}
}