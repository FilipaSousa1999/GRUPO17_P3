// On loading the page, run the init function
onload = () => {
    init()
};

// Global variables
let canvas, renderer, scene, camera, objects, cube, pyramid, material, rotationX, rotationY, rotationZ, light, MousePosX, MousePosY,oldMousePosX,oldMousePosY, calcX, calcY;
let objectsArray = [];
let lightIntensity = 1.0;
const colorLight = 0xffff00; // light color

//light direction
let sun_x = document.getElementById("pos_sun_x").value;
let sun_y = document.getElementById("pos_sun_z").value;
let sun_z = document.getElementById("pos_sun_y").value;
let targ_x = document.getElementById("pos_targ_x").value;
let targ_y = document.getElementById("pos_targ_y").value;
let targ_z = document.getElementById("pos_targ_z").value;

/**
 * Initializes the WebGL application
 */

 document.getElementById("light_selector").onchange = function () {
     scene.remove(light);
     scene.remove(light.target);
     let lightType = document.getElementById("light_selector").value;
     makeLight(lightType);
 }







  document.getElementById("light_Intensity").onchange = function () {
      lightIntensity = document.getElementById("light_Intensity").value;
  }

  function getInputValue() {
          sun_x = document.getElementById("pos_sun_x").value;
          sun_y = document.getElementById("pos_sun_z").value;
          sun_z = document.getElementById("pos_sun_y").value;
          targ_x = document.getElementById("pos_targ_x").value;
          targ_y = document.getElementById("pos_targ_y").value;
          targ_z = document.getElementById("pos_targ_z").value;
          changelight();
  }

function init() {

    // *** Get canvas
    canvas = document.getElementById('gl-canvas');

    // *** Create a render
    // Render is the main object of three.js used to draw scenes to a canvas
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setClearColor(0xffffff);

    // *** Create a scene
    // Scene defines properties like the background, and defines the objects to be rendered
    scene = new THREE.Scene();

    // *** Calculate the objects
    objects = getRndInteger( 5 , 30 );
    for (let numberObjects = 0; numberObjects < objects; numberObjects++) {
        let object = getRndInteger( 0 , 1 );
        if (object === 0) {
            makeCube();
        }
        else {
            makePyramid();
        }
    }
    for (let i = 0; i < objects; i++) {
        scene.add(objectsArray[i]);
    }

    // *** Create a camera
    const fov = 75; // field of view
    const near = 0.1;
    const far = 5;
    // Anything before or after this range will be clipped
    const aspect = canvas.width / canvas.height;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // mimics the way the human eye sees
    camera.position.z = 3;


    // *** Create a light ***
    makeLight("ambient");

    // *** Render
    render();
}

/**
 * Draws a cube with random measures and colors on each face.
 */
function makeCube() {
    const randomMeasure = getRndInteger( 1 , 5 ) / 10
    const boxWidth = randomMeasure;
    const boxHeight = randomMeasure;
    const boxDepth = randomMeasure;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth).toNonIndexed(); // vertex data
    // Specify the colors of the faces
    let colorsArray = [];
    let vertexColors = [
        [1.0, 1.0, 0.0], // yellow
        [0.0, 1.0, 0.0], // green
        [0.0, 0.0, 1.0], // blue
        [1.0, 0.0, 1.0], // magenta
        [0.0, 1.0, 1.0], // cyan
        [1.0, 0.0, 0.0], // red
    ];
    // Set the color of the faces
    for (let face = 0; face < 6; face++) {
        let faceColor = new THREE.Color();
        faceColor.setRGB(...vertexColors[getRndInteger( 0 , 5)]);
        for (let vertex = 0; vertex < 6; vertex++) {
            colorsArray.push(...faceColor);
        }
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3));

    let texture = getRndInteger( 0 , 1 );
    if (texture === 0) {
        material = new THREE.MeshBasicMaterial({vertexColors: true}); // represent the surface properties. Note: the basic material is *not* affected by lights
    }
    else {
        const loader = new THREE.TextureLoader();
        material = new THREE.MeshBasicMaterial({map: loader.load('texture.png')}); // represent the surface properties. Note: the basic material is *not* affected by lights
    }

    cube = new THREE.Mesh(geometry, material); // mesh objects represent drawing a specific Geometry with a specific Material
    cube.translateX(getRndInteger( -10 , 10 ));
    cube.translateY(getRndInteger( -1 , 1 ));
    cube.translateZ(getRndInteger( -10 , 10 ));
    objectsArray.push(cube);
}

/**
 * Draws a pyramid with random radius and colors on each face.
 */
function makePyramid() {
    const pyramidRadius = getRndInteger( 1 , 5 ) / 10;
    const geometry = new THREE.TetrahedronGeometry( pyramidRadius ); // vertex data
    // Specify the colors of the faces
    let colorsArray = [];
    let vertexColors = [
        [1.0, 1.0, 0.0], // yellow
        [0.0, 1.0, 0.0], // green
        [0.0, 0.0, 1.0], // blue
        [1.0, 0.0, 1.0], // magenta
        [0.0, 1.0, 1.0], // cyan
        [1.0, 0.0, 0.0], // red
    ];
    // Set the color of the faces
    for (let face = 0; face < 4; face++) {
        let faceColor = new THREE.Color();
        faceColor.setRGB(...vertexColors[getRndInteger( 0 , 5)]);
        for (let vertex = 0; vertex < 3; vertex++) {
            colorsArray.push(...faceColor);
        }
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3));

    let texture = getRndInteger( 0 , 1 );
    if (texture === 0) {
        material = new THREE.MeshBasicMaterial({vertexColors: true}); // represent the surface properties. Note: the basic material is *not* affected by lights
    }
    else {
        const loader = new THREE.TextureLoader();
        material = new THREE.MeshBasicMaterial({map: loader.load('texture.png')}); // represent the surface properties. Note: the basic material is *not* affected by lights
    }

    pyramid = new THREE.Mesh(geometry, material); // mesh objects represent drawing a specific Geometry with a specific Material
    pyramid.translateX(getRndInteger( -10 , 10 ));
    pyramid.translateY(getRndInteger( -1 , 1 ));
    pyramid.translateZ(getRndInteger( -10 , 10 ));
    objectsArray.push(pyramid);
}

/**
 * movement - w a s d keys
 */
const xSpeed = 0.1;
const zSpeed = 0.1;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    let keyCode = event.which;
    if (keyCode == 83) {
        camera.position.z += zSpeed;
    } else if (keyCode == 87) {
        camera.position.z -= zSpeed;
    } else if (keyCode == 65) {
        camera.position.x -= xSpeed;
    } else if (keyCode == 68) {
        camera.position.x += xSpeed;
    }
}


let screenLog = document.querySelector("#screen-log");
document.addEventListener("mousemove", exit_pos);

function exit_pos(e) {
     screenLog.innerText = `
         Screen X/Y: ${e.screenX}, ${e.screenY}
         Client X/Y: ${e.clientX}, ${e.clientY}`;
     MousePosX = e.clientX;
     MousePosY = e.clientY;
     camera.rotation.y=-MousePosX/100;;
     //camera.rotation.z=MousePosX/1000;
     camera.rotation.x=-MousePosY/100;
 }





/**
 * Renders the scene.
 */
rotationX = getRndInteger( -20 , 20 ) / 100;
rotationY = getRndInteger( -20 , 20 ) / 100;
rotationZ = getRndInteger( -20 , 20 ) / 100;
function render() {
    for (let i = 0; i < objects; i++) {
        // Apply rotation
        objectsArray[i].rotation.x += rotationX;
        objectsArray[i].rotation.y += rotationY;
        objectsArray[i].rotation.z += rotationZ;
    }
    // Draw the scene
    renderer.render(scene, camera);
    // Make the new frame
    requestAnimationFrame(render);
}

/**
 * Returns random integer between min and max.
 */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function makeLight(lightType) {
        switch (lightType) {
                case "ambient": // light that shoots light in all directions
                    light = new THREE.AmbientLight(colorLight, lightIntensity);
                    break;
                case "directional": // often used to represent the sun, and will shine in the direction of its target
                    light = new THREE.DirectionalLight(colorLight, lightIntensity);
                    light.position.set(sun_x, sun_y, sun_z);
                    light.target.position.set(targ_x, targ_y, targ_y);
                    scene.add(light.target);
                    break;
                default:
                    return -1;
            }
            scene.add(light);
        }


function changelight() {
    if (lightType == "directional") {
        light.position.set(sun_x, sun_y, sun_z);
        light.target.position.set(targ_x, targ_y, targ_y);
    }
}