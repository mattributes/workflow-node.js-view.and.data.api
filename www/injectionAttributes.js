var InjectionPoint = function(obj){
	this.location = obj.location;
	this.temperature = 0;
	this.velocity = 0;

	//create new instance in panel.
	Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance.addPoint(this);
};

InjectionPoint.prototype.attachToGeometry = function(){

};

InjectionPoint.prototype.setTemperature = function(val){
	this.tempereature = val;
	//console.log(this);
}

InjectionPoint.prototype.setVelocity = function(val){
	this.velocity = val;
	//console.log(this);
}

//Injection Manager
//keeps track of all injection points
var InjectionManager = function(viewer){
	viewer.addEventListener("selection", this.handleSelection.bind(this));

	var self = this;	
	$("#viewerDiv").click(function(e) {
		var x = e.offsetX/viewer.container.offsetWidth;
		var y = e.offsetY/viewer.container.offsetHeight;
		var location = viewer.utilities.getHitPoint(x, y);
		if (!location) {
			console.log('bad');
			return;
		}

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
