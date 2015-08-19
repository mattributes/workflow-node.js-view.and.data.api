var pts_ = [];
var inj_pts_ = [];

var configureSimulation = function()
{
	var n_pts = 100;
	var n_inj_pts = 3;

	for(var i=0; i<n_pts; i++){
		pts_.push(
			{
				id: i,
				xyz: [Math.random(), Math.random(), Math.random()]
			});
	}

	for(var i=0; i<n_inj_pts; i++){
		inj_pts_.push(
			{
				id: i,
				xyz: [Math.random(), Math.random(), Math.random()]
			});
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

var runSimulation = function(pts, inj_pts)
{
	console.log("Running simluation... ", "Points: ", pts, "Injection Points: ", inj_pts);

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

var simulatePointTime = function(p, inj_pts)
{
	var closest_inj_pt_id = getClosestInjectionPoint(p, inj_pts);
	var res = pointToPointDistance3D(p.xyz, inj_pts[closest_inj_pt_id].xyz);
	return res;
}

configureSimulation();
var res = runSimulation(pts_, inj_pts_);
console.log("Simulation Results: ", res);






