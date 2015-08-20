var heatmap_mesh = null;
var heatmap_mesh_name = "HeatmapMesh";

var runSimulation = function(inj_pts)
{
	var modelData = configureSimulation(inj_pts);
	var res = runSimulationInternal(modelData.pts, modelData.inj_pts);
	visualizeSimulationResults(modelData.pts, modelData.faces, res);
	return res;
}

var configureSimulation = function(inj_pts)
{
	var res = {
		pts: [],
		faces: [],
		inj_pts: []
	}
	var viewerCanvas = app.getViewerCanvas();
	var renderProxy = viewerCanvas.impl.getRenderProxy(viewerCanvas.model, 0);
	var stride = renderProxy.geometry.vbstride;
	var coords = renderProxy.geometry.vb;
	var faces = renderProxy.geometry.ib;

	// mesh points
	var pt_count = 0;
	for(var i=0; i<coords.length; i=i+stride, pt_count++){
		res.pts.push({
			id: pt_count,
			xyz: [.11*coords[i], .11*coords[i+1], .11*coords[i+2]]
		})
	}

	//mesh faces
	for(i=0; i<faces.length; i=i+3){
		res.faces.push({
			idxs: [faces[i], faces[i+1], faces[i+2]]
		})
	}

	//injection points
	for(var i=0; i<inj_pts.length; i++){
		res.inj_pts.push(
			{
				id: i,
				xyz: [inj_pts[i].x, inj_pts[i].y, inj_pts[i].z]
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
		app.getViewerCanvas().impl.invalidate(true);
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

function getClosestInjectionPoint(p, inj_p)
{
	var min_dist = Infinity; 
	var closest_id = -1;
	for(var i=0; i<inj_p.length; i++){
		var d = pointToPointDistance3DSquared(p.xyz, inj_p[i].xyz);
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
		res = pointToPointDistance3D(p.xyz, inj_pts[closest_inj_pt_id].xyz);
	}
	return res;
}	

var numColorBins = 11;
var colorScale = ['rgb(165,0,38)','rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,144)','rgb(255,255,191)','rgb(224,243,248)','rgb(171,217,233)','rgb(116,173,209)','rgb(69,117,180)','rgb(49,54,149)'];

function colorFromValue(val, min, max)
{
	var v = (val-min)/(max-min);
	var res = new THREE.Color(colorScale[Math.floor(v*numColorBins)]);
	return res;
}

function createHeatmapGeometry(pts, faces, res)
{
	console.log("min: ", res.min);
	console.log("max: ", res.max);
	//var geom = new THREE.SphereGeometry(10, 20);
	var geom = new THREE.Geometry();

	for(var i=0; i<pts.length; i++){
		var pt = pts[i].xyz;
		geom.vertices.push( new THREE.Vector3( pt[0], pt[1], pt[2] ) );
	}

	for(var i=0; i<faces.length; i++){
		var face = faces[i].idxs;
		geom.faces.push( new THREE.Face3( face[0], face[1], face[2],
											new THREE.Vector3( 0, 0, 1 ),
											[
												colorFromValue(res.array[face[0]].result, res.min, res.max),
												colorFromValue(res.array[face[1]].result, res.min, res.max),
												colorFromValue(res.array[face[2]].result, res.min, res.max)
											]
										)
		);
	}

	geom.computeFaceNormals();
	geom.computeVertexNormals(); 
	return geom;
}

function visualizeSimulationResults(pts, faces, res)
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

	var heatmap_geom = createHeatmapGeometry(pts, faces, res);

	removeObjectByName(heatmap_mesh_name);

	heatmap_mesh =
		new THREE.Mesh(
            heatmap_geom,
            heatmap_material
        );
    heatmap_mesh.position.set(0, 0, 0);
    heatmap_mesh.name = heatmap_mesh_name;
	
	//adding to LMV
	viewerCanvas.impl.scene.add(heatmap_mesh);   
	viewerCanvas.impl.invalidate(true);
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



