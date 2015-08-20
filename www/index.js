/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2014 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    app = new App();
    app.init();

    $('#solve').click(function() {
        var injection_pts = 
            app.getInjectionManager().getInjectionPointsLocation();
        runSimulation(injection_pts);
        showResultsTools(true);
    });
});

function showResultsTools(show) {
    if (show) {
        $('#resultTools').show();
        $('#noResults').hide();
    }
    else {
        $('#resultTools').hide();
        $('#noResults').show();
    }
};

// The following code does not rely on Autodesk.ADN.Toolkit.Viewer.AdnViewerManager
// and uses the Autodesk API directly.
//
//        $(document).ready(function () {
//            var getToken =  function() {
//                var xhr = new XMLHttpRequest();
//                xhr.open("GET", 'http://' + window.location.host + '/api/token', false);
//                xhr.send(null);
//                return xhr.responseText;
//            }
//
//            function initializeViewer(containerId, documentId, role) {
//                var viewerContainer = document.getElementById(containerId);
//                var viewer = new Autodesk.Viewing.Private.GuiViewer3D(
//                        viewerContainer);
//                viewer.start();
//
//                Autodesk.Viewing.Document.load(documentId,
//                        function (document) {
//                            var rootItem = document.getRootItem();
//                            var geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(
//                                    rootItem,
//                                    { 'type': 'geometry', 'role': role },
//                                    true);
//
//                            viewer.load(document.getViewablePath(geometryItems[0]));
//                        },
//
//                        // onErrorCallback
//                        function (msg) {
//                            console.log("Error loading document: " + msg);
//                        }
//                );
//            }
//
//            function initialize() {
//                var options = {
//                    env: "AutodeskProduction",
//                    getAccessToken: getToken,
//                    refreshToken: getToken
//                };
//
//                Autodesk.Viewing.Initializer(options, function () {
//                    initializeViewer('viewerDiv', urn, '3d');
//                });
//            }
//
//            initialize();
//        });
