var App = function() {
  this._documentUrns = [
    // Currently these are duplicates.
    // Dylan will upload some mold flow models and update the array here.

    // MF card holder, "shell_1_of_mfx_card_holder.stl"
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',

    // Name/description of model
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',

    // Name/description of model
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',

    // Name/description of model
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs'
  ];

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
  this.loadDocument(this._documentUrns[0]);
  // window.generateModelsDom(this.getAllDocumentUrns());
};

App.prototype.getAllDocumentUrns = function() {
  return this._documentUrns;
};

App.prototype.getCurrentDocumentUrn = function() {
  return this._currentDocumentUrn;
};

App.prototype.getInjectionManager = function() {
  return this._injectionManager;
};

App.prototype.initViewerCanvas = function() {
  // TODO: Move this function to App.prototype.init().

  // var viewerConfig = {
  //   viewerType: 'GuiViewer3D',
  //   extensions: ['ADN Simple Extension']
  // };

  // var viewer = viewerFactory.createViewer(
  //   $('#viewerDiv')[0],
  //   viewerConfig);

  var viewerCanvas = new Autodesk.Viewing.Private.GuiViewer3D($('#viewerDiv')[0], {
    viewerType: 'GuiViewer3D',
    extensions: ['Autodesk.ADN.Viewing.Extension.UIComponent']
  });

  viewerCanvas.start();
  window.viewer = viewerCanvas;
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
    self._injectionManager = new InjectionManager(viewer);
    self._currentDocumentUrn = urn;
  }, function (error) {
    self._currentDocumentUrn = "";
    self._injectionManager = null;
    console.log('Error in loading urn: ' + error);
  });
};
