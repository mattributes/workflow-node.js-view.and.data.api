var heatmap_mesh = null;
var heatmap_mesh_name = "HeatmapMesh";
var modelData_ = null;
var simulationResults_ = null;

var runSimulation = function(inj_pts)
{
	modelData_ = configureSimulation(inj_pts);
	simulationResults_ = runSimulationInternal(modelData_.pts, modelData_.inj_pts);
	visualizeSimulationResults(modelData_.pts, modelData_.faces, simulationResults_, 1.0);
	return simulationResults_;
}

var visualizeSimulationResultsAtThreshold = function(threshold)
{
	visualizeSimulationResults(modelData_.pts, modelData_.faces, 
		simulationResults_, threshold);
}

var configureSimulation = function(inj_pts)
{
	var res = {
		pts: [],
		faces: [],
		inj_pts: []
	}

	var viewerCanvas = app.getViewerCanvas();
	var savedVertices = {};
	var numFragments = viewerCanvas.model.getFragmentList().fragments.length;
	var prevCount = 0;
	var uniqueVertexCount = 0;

	function addVertex(idx, pt){
		if(!savedVertices[idx]){
			savedVertices[idx] = true;
			res.pts.push({id: idx, xyz: [pt.x, pt.y, pt.z]});
			uniqueVertexCount++;
		}
	}

	for(var fragId=0; fragId<numFragments; fragId++){

		uniqueVertexCount = 0;

		var fragProxy = viewerCanvas.impl.getFragmentProxy(viewerCanvas.model, fragId);

		var renderProxy = viewerCanvas.impl.getRenderProxy(viewerCanvas.model, fragId);

		fragProxy.updateAnimTransform();

		var matrix = new THREE.Matrix4();
		fragProxy.getWorldMatrix(matrix);

		var geometry = renderProxy.geometry;

		var attributes = geometry.attributes;

		var vA = new THREE.Vector3();
		var vB = new THREE.Vector3();
		var vC = new THREE.Vector3();

		if (attributes.index !== undefined) {

		  var indices = attributes.index.array || geometry.ib;
		  var positions = geometry.vb ? geometry.vb : attributes.position.array;
		  var stride = geometry.vb ? geometry.vbstride : 3;
		  var offsets = geometry.offsets;

		  if (!offsets || offsets.length === 0) {
		    offsets = [{start: 0, count: indices.length, index: 0}];
		  }

		  for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {
		    var start = offsets[oi].start;
		    var count = offsets[oi].count;
		    var index = offsets[oi].index;

		    for (var i = start, il = start + count; i < il; i += 3) {
				var a = index + indices[i];
				var b = index + indices[i + 1];
				var c = index + indices[i + 2];

				vA.fromArray(positions, a * stride);
				vB.fromArray(positions, b * stride);
				vC.fromArray(positions, c * stride);

				vA.applyMatrix4(matrix);
				vB.applyMatrix4(matrix);
				vC.applyMatrix4(matrix);

				addVertex(prevCount+a, vA);
				addVertex(prevCount+b, vB);
				addVertex(prevCount+c, vC);	
				
			    //mesh faces
				res.faces.push({idxs: [prevCount + a, prevCount + b, prevCount + c]});
		    }
		    prevCount += uniqueVertexCount;
		  }
		}
	}

	//injection points
	for(var i=0; i<inj_pts.length; i++){
		res.inj_pts.push(
			{
				id: i,
				xyz: [inj_pts[i].location.x, inj_pts[i].location.y, inj_pts[i].location.z],
				temperature: inj_pts[i].temperature,
				velocity: inj_pts[i].velocity
			});
	}

	if(res.pts.length < 3){
		console.error("Simulation Configuration Error: Mesh must have at least three vertices");
	}
	if(res.faces.length < 1){
		console.error("Simulation Configuration Error: Mesh must have at least one face");
	}
	if(res.inj_pts.length < 1){
		console.error("Simulation Configuration Error: Mesh must have at least one injection point");
	}

	return res;
}

var showSimulationResults = function(flag)
{
	var mesh = getObjectByName(heatmap_mesh_name);
	if(mesh){
		mesh.visible = flag;
		app.invalidate();
	}
}

function pointToPointDistance3D(p, q)
{
	return (Math.sqrt(pointToPointDistance3DSquared(p, q)));
}

function pointToPointDistance3DSquared(p, q)
{
	return (Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2) + Math.pow(p[2] - q[2], 2));
}

function ptToInjPtDistanceFunction(p, inj_p)
{
	return pointToPointDistance3DSquared(p.xyz, inj_p.xyz) / inj_p.temperature;
}

function getClosestInjectionPoint(p, inj_p)
{
	var min_dist = Infinity; 
	var closest_id = -1;
	for(var i=0; i<inj_p.length; i++){
		var d = ptToInjPtDistanceFunction(p, inj_p[i]);
		if(d < min_dist){
			closest_id = inj_p[i].id;
			min_dist = d;
		}
	}
	return closest_id;
}

function runSimulationInternal(pts, inj_pts)
{
	var simulationResults = {
		min: Infinity,
		max: -Infinity,
		array: []
	};

	for(var i=0; i<pts.length; i++){
		var res = simulatePointTime(pts[i], inj_pts);
		simulationResults.array.push({
			id: i,
			result: res
		});
	}

	for(var i=0; i<simulationResults.array.length; i++){
		var val = simulationResults.array[i].result;
		if(val<simulationResults.min) simulationResults.min = val;
		if(val>simulationResults.max) simulationResults.max = val;
	}

	return simulationResults;
}

function simulatePointTime(p, inj_pts)
{
	var res = Infinity;
	var closest_inj_pt_id = getClosestInjectionPoint(p, inj_pts);
	if(closest_inj_pt_id != -1){
		// res = pointToPointDistance3D(p.xyz, inj_pts[closest_inj_pt_id].xyz);
		res = ptToInjPtDistanceFunction(p, inj_pts[closest_inj_pt_id]);
	}
	return res;
}	

var numColorBins = 11;
var colorScale = ['rgb(165,0,38)','rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,144)','rgb(255,255,191)','rgb(224,243,248)','rgb(171,217,233)','rgb(116,173,209)','rgb(69,117,180)','rgb(49,54,149)'];

function colorFromValue(val, min, max, threshold)
{
	var v = (val-min)/(max-min);
	var res;
	if(v < threshold){
		res = new THREE.Color(colorScale[Math.floor(v*numColorBins)]);
	} else {
		res = new THREE.Color(0, 0, 0);
	}
	return res;
}

function createHeatmapGeometry(pts, faces, res, time)
{
	//var geom = new THREE.SphereGeometry(10, 20);
	var geom = new THREE.Geometry();

	for(var i=0; i<pts.length; i++){
		var pt = pts[i].xyz;
		geom.vertices.push( new THREE.Vector3( pt[0], pt[1], pt[2] ) );
	}

	for(var i=0; i<faces.length; i++){
		var face = faces[i].idxs;
		geom.faces.push( 
			new THREE.Face3( 
				face[0], 
				face[1], 
				face[2],
				new THREE.Vector3( 0, 0, 1 ),
				[
					colorFromValue(res.array[face[0]].result, res.min, res.max, time),
					colorFromValue(res.array[face[1]].result, res.min, res.max, time),
					colorFromValue(res.array[face[2]].result, res.min, res.max, time)
				]
			)
		);
	}

	geom.computeFaceNormals();
	geom.computeVertexNormals(); 
	return geom;
}

function visualizeSimulationResults(pts, faces, res, time)
{
	var viewerCanvas = app.getViewerCanvas();

	var heatmap_material = new THREE.MeshBasicMaterial(
		{
			color: 0xffffff,
      		opacity: 0.5,
      		shading: THREE.FlatShading,
      		side: THREE.DoubleSide,
      		vertexColors: THREE.VertexColors,
      		envMap: null,
      		specularMap: null,
      		alphaMap: null,
      		lightMap: null
		});
	
	viewerCanvas.impl.matman().addMaterial('ADN-Material'+'heatmap', heatmap_material, true);

	var heatmap_geom = createHeatmapGeometry(pts, faces, res, time);

	removeObjectByName(heatmap_mesh_name);

	heatmap_mesh =
		new THREE.Mesh(
            heatmap_geom,
            heatmap_material
        );
    // heatmap_mesh.position.set(0, 0, 0);
    heatmap_mesh.name = heatmap_mesh_name;
	
	//adding to LMV
	app.getGeomKeeper().addGeometry(heatmap_mesh);
}

function removeObjectByName(name)
{
	var mesh = getObjectByName(name);
	if(mesh){
		app.getViewerCanvas().impl.scene.remove(mesh);
	}
}

function getObjectByName(name)
{
	return app.getViewerCanvas().impl.scene.getObjectByName(name);
}



