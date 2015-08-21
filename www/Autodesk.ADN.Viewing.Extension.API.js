///////////////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.UIComponent
// by Philippe Leefsma, May 2015
//
///////////////////////////////////////////////////////////////////////////////

var UISimulationCtrls = function() {
  var _solveBtn = null;
  var _resultsBtn = null;
};

UISimulationCtrls.instance = function() {
  if (!this._instance) {
    this._instance = new UISimulationCtrls();
  }

  return this._instance;
};

UISimulationCtrls.prototype.enable = function(enabled) {
  // 1: enabled, 2: disabled
  if (enabled) {
    this._solveBtn.setState(1);
    this._resultsBtn.setState(1);
  }
  else {
    this._solveBtn.setState(2);
    this._resultsBtn.setState(2);
  }
}

AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.UIComponent = function (viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);

  var _panel = null;

  var resultsVisible = true;

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  this.load = function () {

    var ctrlGroup = getControlGroup();

    createControls(ctrlGroup);

    _panel = new Autodesk.ADN.Viewing.Extension.UIComponent.Panel(
      viewer.container,
      newGUID());

    Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance = _panel;

    console.log('Autodesk.ADN.Viewing.Extension.UIComponent loaded');

    return true;
  };

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  this.unload = function () {

    try {

      var toolbar = viewer.getToolbar(true);
  
      toolbar.removeControl(
        'Autodesk.ADN.UIComponent.ControlGroup');
    }
    catch (ex) {
      $('#divUIComponentToolbar').remove();
    }

    console.log('Autodesk.ADN.Viewing.Extension.UIComponent unloaded');

    return true;
  };

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  function getControlGroup() {

    var toolbar = null;

    try {
      toolbar = viewer.getToolbar(true);

      if(!toolbar) {
        toolbar = createDivToolbar();
      }
    }
    catch (ex) {
        toolbar = createDivToolbar();
    }

    var control = toolbar.getControl(
      'Autodesk.ADN.UIComponent.ControlGroup');

    if(!control) {

      control = new Autodesk.Viewing.UI.ControlGroup(
        'Autodesk.ADN.UIComponent.ControlGroup');

      toolbar.addControl(control);
    }

    return control;
  }

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  function createDivToolbar() {

    var toolbarDivHtml =
      '<div id="divUIComponentToolbar"> </div>';

    $(viewer.container).append(toolbarDivHtml);

    $('#divUIComponentToolbar').css({
      'bottom': '0%',
      'left': '50%',
      'z-index': '100',
      'position': 'absolute'
    });

    var toolbar = new Autodesk.Viewing.UI.ToolBar(true);

    $('#divUIComponentToolbar')[0].appendChild(
      toolbar.container);

    return toolbar;
  }

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  function createControls(parentGroup) {

    var injectionLocationBtn = createButton(
      'Autodesk.ADN.UIComponent.Button.Show',
      'injectIcon',
      'Show Injection Points',
      onShowPanel);

    var ctrls = UISimulationCtrls.instance();
    ctrls._solveBtn = createButton(
      'Autodesk.ADN.UIComponent.Button.ShowSolve',
      'solveIcon',
      'Solve',
      onSolve);

    ctrls._resultsBtn = createButton(
      'Autodesk.ADN.UIComponent.Button.ShowResults',
      'resultsIcon',
      'Show/hide results',
      onShowHideResults);

    parentGroup.addControl(injectionLocationBtn);
    parentGroup.addControl(ctrls._solveBtn);
    parentGroup.addControl(ctrls._resultsBtn);
  }

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  function onShowPanel() {

    _panel.isOpen = !_panel.isOpen //toggle
    _panel.setVisible(_panel.isOpen);
  }

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  function onSolve() {
    var ctrls = UISimulationCtrls.instance();
    if (ctrls._solveBtn.getState() === 2)
      return;

    window.app.solveCurrentModel();
  }

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  function onShowHideResults() {
    var ctrls = UISimulationCtrls.instance();
    if (ctrls._resultsBtn.getState() === 2)
      return;

    resultsVisible = !resultsVisible;
    window.app.showResults(resultsVisible);
  }

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  function createButton(id, className, tooltip, handler) {

    var button = new Autodesk.Viewing.UI.Button(id);

    button.icon.style.fontSize = "24px";

    button.icon.className = className;

    button.setToolTip(tooltip);

    button.onClick = handler;

    return button;
  }

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  function newGUID() {

    var d = new Date().getTime();

    var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });

    return guid;
  };

  /////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////
  Autodesk.ADN.Viewing.Extension.UIComponent.Panel = function(
    parentContainer,
    baseId) {

    this.content = document.createElement('div');

    this.content.id = baseId + 'PanelContentId';
    this.content.className = 'uicomponent-panel-content';

    this._isOpen = false;

    Autodesk.Viewing.UI.DockingPanel.call(
      this,
      parentContainer,
      baseId,
      "Injection Points",
      {shadow: true});

    this.container.style.right = "0px";
    this.container.style.top = "0px";

    this.container.style.width = "380px";
    this.container.style.height = "400px";

    this.container.style.resize = "auto";

    /*var html = [
      '<div class="uicomponent-panel-container">',
        '<div class="uicomponent-panel-controls-container">',
          '<div>',
            '<button class="btn btn-info" id="' + baseId + 'clearBtn">',
              '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span> Clear',
            '</button>',
            '<button class="btn btn-info" id="' + baseId + 'addBtn">',
              '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Item',
            '</button>',
            '<input class="uicomponent-panel-input" type="text" placeholder=" Name (default: Date)" id="' + baseId + 'itemName">',
          '</div>',
          '<br>',
        '</div>',
        '<div id="' + baseId + 'PanelContainerId" class="list-group uicomponent-panel-list-container">',
        '</div>',
      '</div>'
    ].join('\n');

    $('#' + baseId + 'PanelContentId').html(html);*/

    /////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////
    $('#' + baseId + 'addBtn').click(function(){

      var name =  $('#' + baseId + 'itemName').val();

      name = name.length ? name :
        new Date().toString('d/M/yyyy H:mm:ss');

      var item = {
        name: name,
        id: newGUID(),
        handler: function (){alert('Item: ' + name + ' clicked!')}
      }

      var html = [

        '<div class="list-group-item uicomponent-panel-item" id="' + item.id + '">',
          name,
        '</div>'

      ].join('\n');

      $('#' + baseId + 'PanelContainerId').append(html);

      $('#' + item.id).click(function () {
        item.handler();
      });
    });

    /////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////
    $('#' + baseId + 'clearBtn').click(function(){

      $('#' + baseId + 'PanelContainerId > div').each(
        function (idx, child) {
          $(child).remove();
        }
      )
    });
  };

  Autodesk.ADN.Viewing.Extension.UIComponent.Panel.prototype = Object.create(
    Autodesk.Viewing.UI.DockingPanel.prototype);

  Autodesk.ADN.Viewing.Extension.UIComponent.Panel.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.UIComponent.Panel;

  Autodesk.ADN.Viewing.Extension.UIComponent.Panel.prototype.addPoint = function(point){

    this.deselectAll();

    var tempInput = $("<input class='uicomponent-panel-input temperatureInput' type='text'></input>").val(point.temperature);
    var velocityInput = $("<input class='uicomponent-panel-input velocityInput' type='text'></input>").val(point.velocity);
    var removePointButton = $("<div class='remove glyphicon glyphicon-remove-sign'></div>");
    var pointContainer = $("<div class='pointContainer active'></div>");

    //TODO hacky binding of ui to the point model
    point.uiContainer = pointContainer;


    $("#AllPointsContainer").append(pointContainer.append([
      $("<div class='inputContainer'></div>").append([
        $("<label class='uicomponent-panel-label'>Temperature : </label>"),
        tempInput,
        $("<span class='subLabel'>[&deg;C]</span>")
      ]),
      $("<div class='inputContainer'></div>").append([
        $("<label class='uicomponent-panel-label'>Velocity : </label>"),
        velocityInput,
        $("<span class='subLabel'>[m/s]</span>")
      ]),
      removePointButton
    ]));

    tempInput.on("change", function(){
      point.setTemperature(tempInput.val());
    });

    velocityInput.on("change", function(){
      point.setVelocity(velocityInput.val());
    });

    var self = this;

    pointContainer.on("click", function(){
      self.deselectAll();
      pointContainer.addClass("active");

      point.select();
    });

    removePointButton.on("click", function(){
      //TODO hacking - replace with method to get injection manager
      app._injectionManager.removePoint(point);
    });

    this.setVisible(true);
  };

  Autodesk.ADN.Viewing.Extension.UIComponent.Panel.prototype.deselectAll = function(){
    $(this.content).find(".pointContainer").removeClass("active");
  }

  Autodesk.ADN.Viewing.Extension.UIComponent.Panel.prototype.removeAll = function(){
    $("#AllPointsContainer").empty();
  }

  Autodesk.ADN.Viewing.Extension.UIComponent.Panel.prototype.initialize = function()
  {
    // Override DockingPanel initialize() to:
    // - create a standard title bar
    // - click anywhere on the panel to move

    this.title = this.createTitleBar(
      this.titleLabel ||
      this.container.id);

    this.closer = this.createCloseButton();

    var self = this;

    $(this.closer).on("click", function(){
      self.isOpen = false;
      //set deactive
    });

    this.container.appendChild(this.title);
    this.title.appendChild(this.closer);

    $(this.content).append($("<div id='AllPointsContainer'></div>)"));

    this.container.appendChild(this.content);

    this.initializeMoveHandlers(this.title);
    this.initializeCloseHandler(this.closer);
  };

  var css = [

    '.pointContainer{',
      'border: solid 2px #FFFFFF;',
    '}',

    '.pointContainer.active{',
      'border: solid 2px #FF0000;',
    '}',

    'div.uicomponent-panel-content {',
      'height: calc(100% - 5px);',
    '}',

    'div.uicomponent-panel-container {',
      'height: calc(100% - 60px);',
      'margin: 10px;',
    '}',

    'div.uicomponent-panel-controls-container {',
      'margin-bottom: 10px;',
    '}',

    'div.uicomponent-panel-list-container {',
      'height: calc(100% - 60px);',
      'overflow-y: auto;',
    '}',

    'div.uicomponent-panel-item {',
      'margin-left: 0;',
      'margin-right: 0;',
      'color: #FFFFFF;',
      'background-color: #3F4244;',
      'margin-bottom: 5px;',
      'border-radius: 4px;',
    '}',

    'div.uicomponent-panel-item:hover {',
      'background-color: #5BC0DE;',
    '}',

    'label.uicomponent-panel-label {',
      'color: #FFFFFF;',
    '}',

    'input.uicomponent-panel-input {',
      'height: 30px;',
      'width: 150px;',
      'border-radius: 5px;',
    '}',

    '.injectIcon {',
      'background-image:url(/images/injectIcon.png);',
      'display: block;',
      'width: 42px;',
      'height: 42px;',
      'margin-top: -6px;',
      'margin-left: -6px;',
    '}',

    '.solveIcon {',
      'background-image:url(/images/solve-cloud.png);',
      'display: block;',
      'width: 42px;',
      'height: 42px;',
      'margin-top: -6px;',
      'margin-left: -6px;',
    '}',

    '.resultsIcon {',
      'background-image:url(/images/results.png);',
      'display: block;',
      'width: 42px;',
      'height: 42px;',
      'margin-top: -6px;',
      'margin-left: -6px;',
    '}'

  ].join('\n');

  ///////////////////////////////////////////////////////
  // Checks if css is loaded
  //
  ///////////////////////////////////////////////////////
  function isCssLoaded(name) {
    // TODO: there is a bug here, we had bootstrap loaded, Dylan just returning true
    return true;
    for(var i=0; i < document.styleSheets.length; ++i){

      var styleSheet = document.styleSheets[i];

      if(styleSheet.href && styleSheet.href.indexOf(name) > -1)
        return true;
    };

    return false;
  }

  // loads bootstrap css if needed
  if(!isCssLoaded("bootstrap.css") && !isCssLoaded("bootstrap.min.css")) {

    $('<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.css"/>').appendTo('head');
  }

  $('<style type="text/css">' + css + '</style>').appendTo('head');
};

Autodesk.ADN.Viewing.Extension.UIComponent.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.UIComponent.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.UIComponent;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.UIComponent',
  Autodesk.ADN.Viewing.Extension.UIComponent);
