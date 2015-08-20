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
	var renderProxy = viewer.impl.getRenderProxy(viewer.model, 0);
	var stride = renderProxy.geometry.vbstride;
	var coords = renderProxy.geometry.vb;
	var faces = renderProxy.geometry.ib;

	// mesh points
	var pt_count = 0;
	for(var i=0; i<coords.length; i=i+stride, pt_count++){
		res.pts.push({
			id: pt_count,
			xyz: [coords[i], coords[i+1], coords[i+2]]
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
	var simulationResults = [];

	for(var i=0; i<pts.length; i++){
		var res = simulatePointTime(pts[i], inj_pts);
		simulationResults.push({
			id: i,
			result: res
		});
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

var heatmap_material = null;
var heatmap_mesh = null;


function createHeatmapGeometry(pts, faces, res)
{
	//var geom = new THREE.SphereGeometry(10, 20);
	var geom = new THREE.Geometry();

	for(var i=0; i<pts.length; i++){
		var pt = pts[i].xyz;
		geom.vertices.push( new THREE.Vector3( pt[0], pt[1], pt[2] ) );
	}

	for(var i=0; i<faces.length; i++){
		var face = faces[i].idxs;
		geom.faces.push( new THREE.Face3( face[0], face[1], face[2] ) );
	}

	for(var i=0; i<res.length; i++){
		geom.colors.push( new THREE.Color(1,1,0) );
	}
	return geom;
}

function visualizeSimulationResults(pts, faces, res)
{
	if(heatmap_material){

	} else {
		heatmap_material =
		    new THREE.MeshBasicMaterial({
		    	vertexColors: THREE.VertexColors 
		    });

			// new THREE.MeshDepthMaterial();

			// new THREE.MeshLambertMaterial({
			// 	vertexColors: THREE.VertexColors
			// });

			// new THREE.MeshBasicMaterial({
			//       color: Math.floor(Math.random() * 16777215),
			//       shading: THREE.FlatShading,
			//       side: THREE.DoubleSide
			// });

			// new THREE.LineBasicMaterial({
			// 	vertexColors: THREE.VertexColors
			// });
		
		//add material to collection
	    viewer.impl.matman().addMaterial(
		    'HeatmapMaterial',
		    heatmap_material,
		    true);
	}

	if(heatmap_mesh){

	} else {
		var heatmap_geom = createHeatmapGeometry(pts, faces, res);

		heatmap_mesh =
			new THREE.Mesh(
                heatmap_geom,           
                heatmap_material
            );
        heatmap_mesh.position.set(0, 0, 0);
		viewer.impl.scene.add(heatmap_mesh);   
	}   

	viewer.impl.invalidate(true);
}




