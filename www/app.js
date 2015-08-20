var App = function() {
  this._currentDocumentUrn = "";
  this._injectionManager = null;
  this._viewerFactory = null;
  this._viewerCanvas = null;
};

App.prototype.init = function() {
  var tokenurl = 'http://' + window.location.host + '/api/token';
  var config = {
    // environment : 'AutodeskProduction'
    environment : 'AutodeskStaging'
  };

  this._viewerFactory = new Autodesk.ADN.Toolkit.Viewer.AdnViewerFactory(tokenurl, config);
  this.loadDocument(App.getAllDocumentUrns()[0]);
};

App.getAllDocumentUrns = function() {
  return [
    // plate20x20x2-5.STL
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTIwLTE2LTQ2LTA1LXR1dnI2cGVzZjd3YWtncG13dXF0aHZ3dXEzc3IvcGxhdGUyMHgyMHgyLTUuU1RM',

    // MF card holder, "shell_1_of_mfx_card_holder.stl"
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',

    // // Name/description of model
    // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',

    // // Name/description of model
    // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',

    // // Name/description of model
    // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs'
  ];
};

App.prototype.getCurrentDocumentUrn = function() {
  return this._currentDocumentUrn;
};

App.prototype.getInjectionManager = function() {
  return this._injectionManager;
};


// TODO: Move this function to App.prototype.init().
App.prototype.initViewerCanvas = function() {
  // var viewerConfig = {viewerType: 'GuiViewer3D', extensions: ['ADN Simple Extension']};
  // var viewer = viewerFactory.createViewer($('#viewerDiv')[0], viewerConfig);

  var viewerCanvas = new Autodesk.Viewing.Private.GuiViewer3D($('#viewerDiv')[0], {
    viewerType: 'GuiViewer3D',
    extensions: ['Autodesk.ADN.Viewing.Extension.UIComponent']
  });

  viewerCanvas.start();
  this._viewerCanvas = viewerCanvas;
  return viewerCanvas;
};


App.prototype.getViewerCanvas = function() {
  if (this._viewerCanvas) {
    return this._viewerCanvas;
  }
  return this.initViewerCanvas();
};

App.prototype.loadDocument = function(urn) {
  var self = this;
  this._viewerFactory.getViewablePath(urn, function(pathInfoCollection) {
    var viewerCanvas = self.getViewerCanvas();
    viewerCanvas.impl.unloadCurrentModel();
    viewerCanvas.load(pathInfoCollection.path3d[0].path);

    self._injectionManager = InjectionManager.instance();
    self._currentDocumentUrn = urn;

    self._injectionManager.reset();

  }, function (error) {
    self._currentDocumentUrn = "";
    self._injectionManager = null;
    console.log('Error in loading urn: ' + error);
  });
};

App.prototype.solveCurrentModel = function() {
    var injection_pts = this.getInjectionManager().getInjectionPointsLocation();
    runSimulation(injection_pts);
};
