var App = function() {
  this._currentDocumentUrn = "";
  this._injectionManager = null;
  this._viewerFactory = null;
  this._viewerCanvas = null;
  this._userInfo = null;
  this._tokenurl = 'http://' + window.location.host + '/api/token';
  this._apiUrl = "https://developer-stg.api.autodesk.com";
  this._bucketName = "hrlmvhackers_1";
  this._viewDataClient = null; // The file uploader
  this._config = {
    // environment : 'AutodeskProduction'
    environment : 'AutodeskStaging'
  };
};

App.prototype.init = function() {

  if (this._userInfo !== null) {
    this.createUserContent();
  }
};

App.prototype.createUserContent = function() {
    this._viewerFactory = new Autodesk.ADN.Toolkit.Viewer.AdnViewerFactory(this._tokenurl, this._config);
    this.loadDocument(App.getAllDocumentUrns()[0]);
};

// NB: should not need to call this, it is just here to create the bucket the first time, see comment in doUploadFiles to recreate if needed
App.prototype.createBucket = function() {
  var bucketCreationData = {
      bucketKey: this._bucketName,
      servicesAllowed: {},
      policyKey: 'transient'
  }

  this._viewDataClient.createBucketAsync(bucketCreationData, function (response) {
    //onSuccess
    console.log('Bucket creation successful:');
    console.log(response);
  },
  function (error) {
    //onError
    console.log('Bucket creation failed:');
    console.log(error);
    console.log('Exiting ...');
  });
}

App.prototype.doUploadFiles = function(files) {
  var self = this;

  self._viewDataClient = new Autodesk.ADN.Toolkit.ViewAndData.ViewAndDataClient(self._apiUrl, this._tokenurl);
  self._viewDataClient.onInitialized(function() {

    // Uncomment this to recreate the bucket if needed
    //self.createBucket();

    for(var i = 0; i < files.length; ++i) {
        var file = files[i];
        self._viewDataClient.uploadFileAsync(file, self._bucketName, file.name, function(response) {
          var fileId = response.objectId;
          var registerResponse = self._viewDataClient.register(fileId);

          console.log(fileId);
          console.log(registerResponse);

          if (registerResponse.Result !== "Success" && registerResponse.Result !== "Created") {
              alert("Sorry old chap, we couldn't upload that document");
              return;
          }

          var timer = setInterval(function() {
              self._viewDataClient.getViewableAsync(fileId, function(response) {
                      console.log(response.progress);
                      if (response.progress === "complete") {
                          clearInterval(timer);
                          console.log("response.urn= ",response.urn);
                          console.log(file.name);

                          // TODO: update client UI
                          //sendNotification(response.urn, file.name);
                      }
              });

          }, 2000);
      },
      function(err) {
          console.log(err);
      });
    }
})


};

App.getAllDocumentUrns = function() {
  return [
  // NB: these are docs Dylan uploaded via the app - but can't be rendered. WIP/TODO:
  // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aHJsbXZoYWNrZXJzXzEvbW1fcmFjZXRyYWNrLnN0bA==',

  // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aHJsbXZoYWNrZXJzXzEvRHVzdHBhbi5zdGw=',
    // MF card holder, "shell_1_of_mfx_card_holder.stl"
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',

    // plate20x20x2-5.STL
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTIwLTE2LTQ2LTA1LXR1dnI2cGVzZjd3YWtncG13dXF0aHZ3dXEzc3IvcGxhdGUyMHgyMHgyLTUuU1RM'

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

    self._injectionManager = InjectionManager.getOrCreateInstance();
    self._currentDocumentUrn = urn;

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

App.prototype.onLoginCallback = function(href){
   var params = parseQueryString(href);

   if(params == null && params['openid.mode'] == null){
      console.error('Login parameters have wrong format ' + params);
      return;
   }

   if(params['openid.mode'] === "setup_needed"){
      // we are not signed in
      this.resetLoginBtn();
      $("#userContent").css('display', 'none');
      $("#loginRequired").css('display', 'inline');
   }
   else{
       // we are signed in
      $('#signIn').css('display', 'none');
      $('#signOut').css('display', 'inline');
      $('#signOut').html(params['openid.alias3.value.alias1']);

      this._userInfo = {};
      this._userInfo.name         = params['openid.alias3.value.alias1'] || '';
      this._userInfo.avatarUrl    = params['openid.alias3.value.alias2'] || '';
      this._userInfo.oxygenId     = params['openid.alias3.value.alias3'] || '';
      this._userInfo.identityUrl  = params['openid.identity'] || '';

      $("#userContent").css('display', 'inline');
      $("#loginRequired").css('display', 'none');
      this.createUserContent();

      var msg = this._userInfo.name + "'s models";
      $("#userFiles").html(msg);
   }

   Oxygen.hide();
};

App.prototype.signIn = function(){
   Oxygen.show();
};

App.prototype.signOut = function() {
  Oxygen.signOut();
  this.resetLoginBtn();
  this._userInfo = null;
  $("#userContent").css('display', 'none');
  $("#loginRequired").css('display', 'inline');
};

App.prototype.resetLoginBtn = function() {
   $('#signIn').css('display', 'inline');
   $('#signOut').css('display', 'none');
};
