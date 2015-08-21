var App = function() {
  this._currentDocumentUrn = "";
  this._injectionManager = null;
  this._viewerFactory = null;
  this._viewerCanvas = null;
  this._geomKeeper = null;
  this._userInfo = null;
  this._tokenurl = 'http://' + window.location.host + '/api/token';
  this._apiUrl = "https://developer-stg.api.autodesk.com";
  this._bucketName = "hrlmvhackers_1";
  this._viewDataClient = null; // The file uploader
  this._config = {
    // environment : 'AutodeskProduction'
    environment : 'AutodeskStaging'
  };
  this._knownModels = [
    // Bike (3DS)
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aHJsbXZoYWNrZXJzXzEvTW90dG8uM2Rz',
    // Piece die (STL)
    "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aHJsbXZoYWNrZXJzXzEvcGVhY2UuU1RM",
    // Chopper (OBJ)
    "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aHJsbXZoYWNrZXJzXzEvdWg2MC5vYmo=",
    // 707.3ds
    "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6aHJsbXZoYWNrZXJzXzEvNzA3LjNEUw==",
    // NB: these are docs Dylan uploaded via the app - but can't be rendered. WIP/TODO:, both are STL's...
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
  
  this._commentsApp = null;
};

App.prototype.init = function() {
  if (this._userInfo !== null) {
    this.createUserContent();
  }

  this.attachEvents();
};

App.prototype.createUserContent = function() {
    this._viewerFactory = new Autodesk.ADN.Toolkit.Viewer.AdnViewerFactory(this._tokenurl, this._config);
    this.loadDocument(this.getAllDocumentUrns()[0]);
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
                          self._knownModels.unshift(response.urn);
                          reGenerateModelsDom();
                          self.loadDocument(response.urn);
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

App.prototype.getAllDocumentUrns = function() {
  return this._knownModels;
};

App.prototype.getCurrentDocumentUrn = function() {
  return this._currentDocumentUrn;
};

App.prototype.getInjectionManager = function() {
  return this._injectionManager;
};

// Call this to notify the application of a change that can result on the simulation 
App.prototype.modelChanged = function() {
  this.showResults(false);

  var enable = true;
  if (!this.getInjectionManager() || !this.getInjectionManager().getInjectionPoints() || this.getInjectionManager().getInjectionPoints().length <= 0) {
    enable = false;
  }

  UISimulationCtrls.instance().enable(enable);
};

App.prototype.getGeomKeeper = function() {
  return this._geomKeeper;
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

App.prototype.invalidate = function() {
  this.getViewerCanvas().impl.invalidate(true, false, true);
}

App.prototype.loadDocument = function(urn) {
  var self = this;
  this._viewerFactory.getViewablePath(urn, function(pathInfoCollection) {
    var viewerCanvas = self.getViewerCanvas();
    viewerCanvas.impl.unloadCurrentModel();
    viewerCanvas.load(pathInfoCollection.path3d[0].path);

    self._injectionManager = InjectionManager.getOrCreateInstance();
    self._geomKeeper = GeomKeeper.getOrCreateInstance();
    self._currentDocumentUrn = urn;

    self.loadCommentsForCurrentDocument();
  }, function (error) {
    self._currentDocumentUrn = "";
    self._injectionManager = null;
    console.log('Error in loading urn: ' + error);
  });
};

App.prototype.solveCurrentModel = function() {
    var injection_pts = this.getInjectionManager().getInjectionPoints();
    runSimulation(injection_pts);
    this.showResults(true);
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
      $('#NavItems').show();
      $('#signOut').html(params['openid.alias3.value.alias1']);

      this._userInfo = {};
      this._userInfo.name         = params['openid.alias3.value.alias1'] || '';
      this._userInfo.avatarUrl    = params['openid.alias3.value.alias2'] || '';
      this._userInfo.oxygenId     = params['openid.alias3.value.alias3'] || '';
      this._userInfo.identityUrl  = params['openid.identity'] || '';

      $("#userContent").css('display', 'block');
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
  $('#NavItems').hide();
  $("#userContent").css('display', 'none');
  $("#loginRequired").css('display', 'inline');
};

App.prototype.resetLoginBtn = function() {
   $('#signIn').css('display', 'inline');
   $('#signOut').css('display', 'none');
};

App.prototype.showResults = function(flag) {
  if (!app.getViewerCanvas() || !app.getViewerCanvas().model)
    return;

  app.getViewerCanvas().model.setHighlighted(0, false);
  app.getViewerCanvas().model.setAllVisibility(!flag);
  showSimulationResults(flag);
}

App.prototype.getToken = function() {
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.open('GET', this._tokenurl, false);
   xmlHttp.send(null);
   var resp =  JSON.parse(xmlHttp.responseText);
   return resp.access_token;
}

App.prototype.loadCommentsForCurrentDocument = function() {
   $('#commentPanel').html('');
   this._commentsApp = null;

   if(this.getCurrentDocumentUrn() === null) {
      return;
   }

   var self = this;

   // prepare comments setup
   var settings = {
      exportGlobal          : true,
      fakeServer            : false,
      markersAlwaysVisible  : true,
      useAcm                : true,
      urn                   : 'urn:adsk.comments:fs.file:' + self.getCurrentDocumentUrn(),
      oauth2token           : self.getToken(),
      version               : 1,
      isOwner               : true,
      commentId             : null,
      env                   : self._config.environment,
      avatarUrl             : self._userInfo.avatarUrl,
      displayName           : self._userInfo.name,
      oxygenId              : self._userInfo.oxygenId,
      messageOverlayZIndex  : '999999',
      features              : ['markups', 'replies', 'snapshot', 'annotations'],
      //postCommentCallback   : function(dbComment) { self.commentsCallback(dbComment); }
   };

   //hack
   $("#commentPanel").height($("#viewerDiv").height() - 2);

   // create comments UI application

   this._commentsApp = Autodesk.Comments2.createCommentsApp(null, "commentPanel", settings);
   this._commentsApp.initialize();
};

//App.prototype.commentsCallback = function(dbComment) {
//  console.log(dbComment);
//};

App.prototype.attachEvents = function(){
  $("#FilesNav").on("click", function(){
    console.log($("FilesDisplay"))
    $("#FilesDisplay").toggleClass("active");
  });

  $("#CommentNav").on("click", function(){
    console.log($("FilesDisplay"))
    //$("#commentPanel").toggleClass("active");
    $("#userContent").toggleClass("showComments")

    //hack
    $("#commentPanel").height($("#viewerDiv").height() - 2);
  });

  //hack
  $(window).on("resize", function(){
    window.setTimeout(function(){
      //hack
      $("#commentPanel").height($("#viewerDiv").height() - 2);
    },0);
  });
}
