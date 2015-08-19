var InjectionPoint = function(obj){
	this.fragId = obj.fragId;
	this.temperature = 0;
	this.velocity = 0;
};

InjectionPoint.prototype.attachToGeometry = function(){

};

//Injection Manager
//keeps track of all injection points
var InjectionManager = function(viewer){
	viewer.addEventListener("selection", this.handleSelection.bind(this));

	this.all = [];
}

InjectionManager.prototype.handleSelection = function(e){
	//alert("clicked on fragId " + e.fragIdsArray[0]);
	this.add(e.fragIdsArray[0]);
	console.log(this.all);
};

InjectionManager.prototype.add = function(fragId){
	//TODO check if id already exists
	// for(var i =0; i < this.all.length; i++){

	// }

	//temp - create new attr
	var attr = new InjectionPoint({fragId: fragId});
	//TODO check for exisitng Id
	this.all.push(attr);
}


