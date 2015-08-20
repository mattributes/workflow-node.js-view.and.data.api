var InjectionPoint = function(obj){
  this.location = obj.location;
  this.temperature = 0;
  this.velocity = 0;
  this.sphere = null;
};

InjectionPoint.prototype._getBoundingBoxDiagonal = function(viewer) {
  var boundingBox = viewer.model.getBoundingBox();
  var maxpt = boundingBox.max;
  var minpt = boundingBox.min;

  var xdiff = maxpt.x - minpt.x;
  var ydiff = maxpt.y - minpt.y;
  var zdiff = maxpt.z - minpt.z;

  return Math.pow((xdiff * xdiff + ydiff * ydiff + zdiff * zdiff), 0.5);
}

InjectionPoint.prototype.createGeometry = function(viewer) {
  var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  viewer.impl.matman().addMaterial('MaterialForInjectionPoint', material, true);

  var sphereRadius = this._getBoundingBoxDiagonal(viewer) / 50;
  this.sphere = new THREE.Mesh(new THREE.SphereGeometry(sphereRadius, 20), material);
  this.sphere.position.set(this.location.x, this.location.y, this.location.z);

  viewer.impl.scene.add(this.sphere);
  viewer.impl.invalidate(true);
};

InjectionPoint.prototype.attachToGeometry = function(){

};

InjectionPoint.prototype.setTemperature = function(val){
  this.tempereature = val;
}

InjectionPoint.prototype.setVelocity = function(val){
  this.velocity = val;
}

InjectionPoint.prototype.select = function(){
  //TODO hacking - replace with method to get injection manager
  //when selecting a point, deselect all other points.
  app._injectionManager.deselectAllPoints();
  this.sphere.material.color.setHex( 0xff0000 );
  app.getViewerCanvas().impl.invalidate(true);
}

InjectionPoint.prototype.deselect = function(){
  this.sphere.material.color.setHex( 0xffffff );
  app.getViewerCanvas().impl.invalidate(true);
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
    self.add(location, viewer);
  });

  this.injectionPoints = [];
}

InjectionManager.prototype.handleSelection = function(e){
  // alert("clicked on fragId " + e.fragIdsArray[0]);
  // this.add(e.fragIdsArray[0]);
  // console.log(this.all);
};

InjectionManager.prototype.add = function(location, viewer) {
  this.deselectAllPoints();
  var injectionPoint = new InjectionPoint({location: location});
  injectionPoint.createGeometry(viewer);
  Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance.addPoint(injectionPoint);
  this.injectionPoints.push(injectionPoint);
}

InjectionManager.prototype.deselectAllPoints = function() {
  _.each(this.injectionPoints, function(p){
    p.deselect();
  });
};

InjectionManager.prototype.getInjectionPointsLocation = function()
{
  var res = [];
  for(var i=0; i<this.injectionPoints.length; i++){
    res.push( this.injectionPoints[i].location );
  } 
  return res;
}
