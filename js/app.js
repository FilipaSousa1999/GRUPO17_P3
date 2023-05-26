// On loading the page, run the init function
onload = () => {
    init()
};

// Global variables
let canvas, renderer, scene, camera, objects, cube, pyramid, material, rotationX, rotationY, rotationZ, light;
let objectsArray = [];

/**
 * Initializes the WebGL application
 */
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


    // *** Create the event listeners for the buttons
    document.getElementById("getInputValues").onclick = makeLight;

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
        material = new THREE.MeshPhongMaterial({vertexColors: true, shininess: 35}); // represent the surface properties
    }
    else {
        const loader = new THREE.TextureLoader();
        material = new THREE.MeshPhongMaterial({map: loader.load('texture.png'), shininess: 35}); // represent the surface properties
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
        material = new THREE.MeshPhongMaterial({vertexColors: true, shininess: 35}); // represent the surface properties
    }
    else {
        const loader = new THREE.TextureLoader();
        material = new THREE.MeshPhongMaterial({map: loader.load('texture.png'), shininess: 35}); // represent the surface properties
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

/**
 * Renders the scene.
 */
rotationX = getRndInteger( -10 , 10 ) / 100;
rotationY = getRndInteger( -10 , 10 ) / 100;
rotationZ = getRndInteger( -10 , 10 ) / 100;
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

function makeLight() {
    scene.remove(light);
    let lightType = document.getElementById("light_selector").value;
    let lightIntensityR = document.getElementById("light_Intensity_r").value;
    let lightIntensityG = document.getElementById("light_Intensity_g").value;
    let lightIntensityB = document.getElementById("light_Intensity_b").value;
    let sun_x = document.getElementById("pos_sun_x").value;
    let sun_y = document.getElementById("pos_sun_y").value;
    let sun_z = document.getElementById("pos_sun_z").value;

    // If the ambient light has all the fields field
    let ambient = lightType==="ambient" && lightIntensityR && lightIntensityG && lightIntensityB;

    // If the directional light has all the fields field
    let directional = lightType==="directional" && lightIntensityR && lightIntensityG && lightIntensityB && sun_x && sun_y && sun_z;

    let color = new THREE.Color("rgb(" + lightIntensityR + "," + lightIntensityG + "," + lightIntensityB + ")");

    if (ambient) {
        light = new THREE.AmbientLight(color);
    }

    else if (directional) {
                    light = new THREE.DirectionalLight(color);
                    light.position.set(sun_x, sun_y, sun_z);
    }

    scene.add(light);
}