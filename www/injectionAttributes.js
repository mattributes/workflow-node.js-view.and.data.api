var InjectionPoint = function(obj){
  this.location = obj.location;
  this.temperature = 200;
  this.velocity = 100;
  this.geomId = -1;

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
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(sphereRadius, 20), material);
  sphere.position.set(this.location.x, this.location.y, this.location.z);

  this.geomId = app.getGeomKeeper().addGeometry(sphere);
};

InjectionPoint.prototype.setTemperature = function(val){
  this.temperature = val;
}

InjectionPoint.prototype.setVelocity = function(val){
  this.velocity = val;
}

InjectionPoint.prototype.select = function(){
  //TODO hacking - replace with method to get injection manager
  //when selecting a point, deselect all other points.
  app._injectionManager.deselectAllPoints();
  app.getGeomKeeper().getGeometry(this.geomId).material.color.setHex( 0xff0000 );
  app.invalidate();

  //when selecting a point - show panel
  Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance.deselectAll();
  Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance.setVisible(true);
  //hack!
  this.uiContainer.addClass("active");
}

InjectionPoint.prototype.deselect = function(){
  app.getGeomKeeper().getGeometry(this.geomId).material.color.setHex( 0xffffff );
  app.invalidate();
}

InjectionPoint.prototype.delete = function(){
  app.getGeomKeeper().removeGeometry(this.geomId);
  this.uiContainer.remove();
}

//Injection Manager
//keeps track of all injection points
var InjectionManager = function(){
  var viewer = app.getViewerCanvas();

  var getRayCaster = function(e) {
    var x = e.offsetX/viewer.container.offsetWidth;
    var y = e.offsetY/viewer.container.offsetHeight;

    y = 1.0 - y;
    x = x * 2.0 - 1.0;
    y = y * 2.0 - 1.0;
    var vpVec = new THREE.Vector3(x, y, 1);
    var viewerImpl = app.getViewerCanvas().impl;
    var ray = viewerImpl.viewportToRay(vpVec);
    return new THREE.Raycaster(ray.origin, ray.direction, viewerImpl.camera.near, viewerImpl.camera.far);
  };

  var self = this;
  var hitTestForInjectionPoints = function(e, callback) {
    if (Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance.isOpen) {
      return;
    }

    var rayCaster = getRayCaster(e);
    var objects = _(self.injectionPoints).map(function(point) {
      return app.getGeomKeeper().getGeometry(point.geomId);
    });
    var pointsFound = rayCaster.intersectObjects(objects);
    if (pointsFound.length>0) {
      callback(pointsFound[0]);
    } else {
      callback(null);
    }
  };

  var hitTestForModelGeom = function(e, callback) {
    if (!Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance.isOpen) {
      return;
    }

    var x = e.offsetX/viewer.container.offsetWidth;
    var y = e.offsetY/viewer.container.offsetHeight;
    var location = viewer.utilities.getHitPoint(x, y);
    callback(location);
  };

  $("#viewerDiv").click(function(e) {
    hitTestForModelGeom(e, function(location) {
      if (!location) {
        return;
      }
      viewer.clearSelection();
      self.add(location, viewer);
    });
  });

  $("#viewerDiv").click(function(e) {
    hitTestForInjectionPoints(e, function(found) {
      if (!found) {
        self.deselectAllPoints();
        return;
      }

      viewer.clearSelection();
      _(self.injectionPoints).each(function(injectionPoint){
        if (injectionPoint.geomId === found.object.id) {
          injectionPoint.select();
        }
      })
    });
  });

  //updates cursor when over model
  $("#viewerDiv").on("mousemove", function(e) {
    var $that = $(this);
    hitTestForModelGeom(e, function(location) {
      if (!location) {
        $that.removeClass("injectCursor");
        return;
      }
      $that.addClass("injectCursor");
    });
  });

  $("#viewerDiv").on("mousemove", function(e) {
    var $that = $(this);
    hitTestForInjectionPoints(e, function(found) {
      if (!found) {
        $that.removeClass("cursorForPointSelection");
        return;
      }
      $that.addClass("cursorForPointSelection");
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

  app.modelChanged();
}

InjectionManager.prototype.deselectAllPoints = function() {
  _.each(this.injectionPoints, function(p){
    p.deselect();
  });
};

InjectionManager.prototype._reset = function() {
  _.each(this.injectionPoints, function(p){
    p.delete();
  });

  this.injectionPoints = [];
  app.modelChanged();
};

InjectionManager.prototype.removePoint = function(point) {
  point.delete();

  var index = this.injectionPoints.indexOf(point);

  if (index > -1) {
    this.injectionPoints.splice(index, 1);
  }

  app.modelChanged();
};

InjectionManager.prototype.getInjectionPointsLocation = function()
{
  var res = [];
  for(var i=0; i<this.injectionPoints.length; i++){
    res.push( this.injectionPoints[i].location );
  } 
  return res;
}

InjectionManager.prototype.getInjectionPoints = function()
{
  return this.injectionPoints;
}

