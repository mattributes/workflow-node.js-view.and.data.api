var InjectionPoint = function(obj){
  this.location = obj.location;
  this.temperature = 0;
  this.velocity = 0;
  this.sphere = null;

  //TODO hacky way of view binding to model
  this.uiContainer = null;
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

InjectionPoint.prototype.delete = function(){
  app.getViewerCanvas().impl.scene.remove(this.sphere);
  app.getViewerCanvas().impl.invalidate(true);
  this.uiContainer.remove();
}

//Injection Manager
//keeps track of all injection points
var InjectionManager = function(){
  var viewer = app.getViewerCanvas();

  var hitTestWithEvent = function(e, callback) {
    var x = e.offsetX/viewer.container.offsetWidth;
    var y = e.offsetY/viewer.container.offsetHeight;
    var location = viewer.utilities.getHitPoint(x, y);
    callback(location);
  };

  var self = this;
  $("#viewerDiv").click(function(e) {
    hitTestWithEvent(e, function(location) {
      if (!location) {
        return;
      }
      self.add(location, viewer);
    });
  });

  //updates cursor when over model
  $("#viewerDiv").on("mousemove", function(e) {
    var $that = $(this);
    hitTestWithEvent(e, function(location) {
      if (!location) {
        $that.removeClass("injectCursor");
        return;
      }
      $that.addClass("injectCursor");
    });
  });

  this.injectionPoints = [];
}

InjectionManager.getOrCreateInstance = function(){
  if (!this._instance){
    this._instance = new InjectionManager();
  }
  this._instance._reset();
  return this._instance;
}

InjectionManager.prototype.add = function(location, viewer) {
  this.deselectAllPoints();

  var injectionPoint = new InjectionPoint({
    location: location
  });

  injectionPoint.createGeometry(viewer);
  Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance.addPoint(injectionPoint);
  this.injectionPoints.push(injectionPoint);
}

InjectionManager.prototype.deselectAllPoints = function() {
  _.each(this.injectionPoints, function(p){
    p.deselect();
  });
};

InjectionManager.prototype._reset = function() {
  var self = this;
  _.each(this.injectionPoints, function(p){
    self.removePoint(p);
  });
};

InjectionManager.prototype.removePoint = function(point) {
  point.delete();

  var index = this.injectionPoints.indexOf(point);

  if (index > -1) {
    this.injectionPoints.splice(index, 1);
  }
};

InjectionManager.prototype.getInjectionPointsLocation = function()
{
  var res = [];
  for(var i=0; i<this.injectionPoints.length; i++){
    res.push( this.injectionPoints[i].location );
  } 
  return res;
}
