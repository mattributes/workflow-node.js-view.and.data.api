///////////////////////////////////////////////////////////////////////////////
// Move viewer Extension
// by Philippe Leefsma, October 2014
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.Move = function (viewer, options) {

    // base constructor
    Autodesk.Viewing.Extension.call(this, viewer, options);

    ///////////////////////////////////////////////////////////////////////////
    // Private members
    //
    ///////////////////////////////////////////////////////////////////////////
    var _selectedGeomId = -1;
    var oldLocation = null;

    var _running = false;

    var _self = this;


    _self.load = function () {

        console.log("Autodesk.ADN.Viewing.Extension.Move loaded");

        $(document).bind(
            'keyup',
            onKeyup);

        $(viewer.container).bind(
          "click",
          onMouseClickInit);

        return true;
    };

    _self.unload = function () {

        console.log("Autodesk.ADN.Viewing.Extension.Move unloaded");

        $(document).unbind(
            'keyup',
            onKeyup);

        cancel();

        return true;
    };

    function onKeyup(event) {

        if (event.keyCode == 27) {
            cancel();
        }
    }

    function cancel() {

        $(viewer.container).unbind(
            "click",
            onMouseClickInit);

        $(viewer.container).unbind(
            "click",
            onMouseClickEnd);

        $(viewer.container).unbind(
            "mousemove",
            onMouseMove);

        _selectedGeomId = -1;

        _running = false;
    };

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

    var hitTestForInjectionPoints = function(e, callback) {
        // if (Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance.isOpen) {
        //     return;
        // }

        var injectionMgr = app.getInjectionManager();

        var rayCaster = getRayCaster(e);
        var objects = _(injectionMgr.injectionPoints).map(function(point) {
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
        // if (!Autodesk.ADN.Viewing.Extension.UIComponent.panelInstance.isOpen) {
        //     return;
        // }

        var x = e.offsetX/viewer.container.offsetWidth;
        var y = e.offsetY/viewer.container.offsetHeight;
        var location = viewer.utilities.getHitPoint(x, y);
        callback(location);
    };

    function onMouseClickInit(event) {
        hitTestForInjectionPoints(event, function(foundPoint) {
            if (!foundPoint) {
                return;
            }

            $(viewer.container).unbind(
                "click",
                onMouseClickInit);

            $(viewer.container).bind(
                "click",
                onMouseClickEnd);

            $(viewer.container).bind(
                "mousemove",
                onMouseMove);

            _running = true;
            _selectedGeomId = foundPoint.object.id;
            debugger;
            var point = app.getGeomKeeper().getGeometry(_selectedGeomId);
            _oldLocation = point.position;
        });
    }

    var handleEventAndTry = function(event) {
        hitTestForModelGeom(event, function(location) {
            var point = app.getGeomKeeper().getGeometry(_selectedGeomId);
            if (!location) {
                location = _oldLocation;
            }
            point.position.set(location.x, location.y, location.z);
            app.invalidate();
            app.modelChanged();
        });
    }

    function onMouseClickEnd(event) {
        if (!_running) {
            return;
        }

        _running = false;
        $(viewer.container).unbind(
            "mousemove",
            onMouseMove);

        $(viewer.container).unbind(
            "click",
            onMouseClickEnd);

        $(viewer.container).bind(
            "click",
            onMouseClickInit);

        handleEventAndTry(event);
    };

    function onMouseMove(event) {
        handleEventAndTry(event);
    };

};

Autodesk.ADN.Viewing.Extension.Move.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.Move.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.Move;

Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.ADN.Viewing.Extension.Move',
    Autodesk.ADN.Viewing.Extension.Move);
