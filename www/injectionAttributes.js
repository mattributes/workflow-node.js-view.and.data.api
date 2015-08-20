var InjectionPoint = function(obj){
	this.location = obj.location;
	this.temperature = 0;
	this.velocity = 0;
};

InjectionPoint.prototype.attachToGeometry = function(){

};

//Injection Manager
//keeps track of all injection points
var InjectionManager = function(viewer){
	viewer.addEventListener("selection", this.handleSelection.bind(this));

	var self = this;	
	$("#viewerDiv").click(function(e) {
		console.log(e);
		var x = e.offsetX/viewer.container.offsetWidth;
		var y = e.offsetY/viewer.container.offsetHeight;
		var location = viewer.utilities.getHitPoint(x, y);
		if (!location) {
			// alert('bad');
			console.log('bad');
			return;
		}

		// alert('good');
		console.log('good');
		self.add(location);
	});

	this.all = [];
}

InjectionManager.prototype.handleSelection = function(e){
	// alert("clicked on fragId " + e.fragIdsArray[0]);
	// this.add(e.fragIdsArray[0]);
	// console.log(this.all);
};

InjectionManager.prototype.add = function(location){
	this.all.push(new InjectionPoint({location: location}));
}


