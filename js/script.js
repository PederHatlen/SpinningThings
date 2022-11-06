let c = document.getElementById("c");
let ctx = c.getContext("2d");

// Random slate color
document.body.style.background = "#"+Math.round(Math.random())*2+Math.round(Math.random())*2+Math.round(Math.random())*2

c.width = 1024;
c.height = 1024;

ctx.translate(c.width/2, c.height/2);
ctx.imageSmoothingEnabled = false;
ctx.fillStyle = "#fff";
ctx.font = "20px monospace";

let run = true, showNumbers = false, showFPS = true;
let pDelta, p3D, p2D, lChart, keyArr = [], clicks = 0, currentObject = 0;
let fps = 60; // For the first frame asume 60 fps, updated every frame

let objects = {
	"cube":[0, cube, cubeLines, 256],
	"teapot":[1, teapoints, tealines, 128],
	"benchy":[2, benchy, benchyLines, 512]
};
function changeObject(obj){
	currentObject = objects[obj][0];
	p3D = objects[obj][1];
	lChart = objects[obj][2];
	pDelta = objects[obj][3];
	keyArr = [];
}

let perfNow = performance.now();

window.addEventListener("keydown", (e)=>{
	if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".includes(e.key)){
		console.log(e.key);
		keyArr.push(e.key);
		switch (keyArr.join("").toLowerCase()) {
			case "cube": changeObject("cube"); keyArr = []; break;
			case "teapot": changeObject("teapot"); keyArr = []; break;
			case "benchy": changeObject("benchy"); keyArr = []; break;
		}
	}else if(e.key == "Backspace") keyArr.pop();
});
window.addEventListener("click", (e)=>{
	if (++clicks >= 5){
		clicks = 0;
		let tempArr = Object.keys(objects);
		changeObject(tempArr[(currentObject+1)%tempArr.length]);
	}
});

function drawLine(ctx, p1, p2, style = "#fff") {
	ctx.strokeStyle = style;
	ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]*-1);
    ctx.lineTo(p2[0], p2[1]*-1);
    ctx.stroke();
}

function rotate(vertex, degrees) {
	return [(Math.cos(degrees)*vertex[0]+Math.sin(degrees)*vertex[2]), vertex[1], (-Math.sin(degrees)*vertex[0]+Math.cos(degrees)*vertex[2])];
}

// a = Point, c = Camera, E = render plane
// https://en.wikipedia.org/wiki/3D_projection
function strongProjection(a, c =[-1024, 1024, 1024], e = [1024, 1024, 1024]){
	let d = [a[0]-c[0], -a[1]+c[1], a[2]-c[2]];
	return [(e[2]/d[2])*d[0]+e[0], (e[2]/d[2])*d[1]+e[1]];
}
function projection(a, foc = 4096){return [(foc*a[0])/(a[2]+foc), (foc*a[1])/(a[2]+foc)+(a[2]/128)*30];} // Stolen from Vemund, with modifications

function drawAxies(ctx){
	drawLine(ctx, projection([-512, 0, 0]), projection([512, 0, 0]), "#f00");
	drawLine(ctx, projection([0, -512, 0]), projection([0, 512, 0]), "#0f0");
	drawLine(ctx, projection([0, 0, -512]), projection([0, 0, 512]), "#00f");
}

function render(){
	ctx.clearRect(-c.width, -c.height, c.width*2, c.height*2);
	p2D = [];

	for(p in p3D){
		p3D[p] = rotate(p3D[p], Math.PI/(fps*5));
		p2D.push([...projection(p3D[p].map((e)=>{return e*pDelta})),parseInt(p)]);
	}

	for(i in lChart) drawLine(ctx, p2D[lChart[i][0]-1], p2D[lChart[i][1]-1]);

	fps = Math.round(1/((performance.now()-perfNow)/1000));
	if(showFPS) ctx.fillText(fps.toString(), -500, -490);
	perfNow = performance.now();

	if(run == true)	window.requestAnimationFrame(render);
}
changeObject("cube");
render();