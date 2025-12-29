// ===============================
// GTA-STYLE 3D MINI CITY
// ===============================

function createWorld(scene) {
    const world = {};

    // Ground
    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(20, 20);

    const groundMat = new THREE.MeshStandardMaterial({ map: groundTexture });
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Roads
    createRoads(scene);

    // Buildings
    createBuildings(scene, loader);

    // Street lights
    createStreetLights(scene);

    // Skybox
    const skyTexture = loader.load('https://threejs.org/examples/textures/skybox/skyboxsun25degtest.png');
    const skyGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    return world;
}

// -------------------------------
// ROADS
// -------------------------------
function createRoads(scene) {
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const roadWidth = 4;
    const roadSpacing = 10;

    for (let i = -90; i <= 90; i += roadSpacing) {
        const roadGeo = new THREE.BoxGeometry(200, 0.1, roadWidth);
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.position.z = i;
        road.position.y = 0.05;
        road.receiveShadow = true;
        scene.add(road);
    }

    for (let i = -90; i <= 90; i += roadSpacing) {
        const roadGeo = new THREE.BoxGeometry(roadWidth, 0.1, 200);
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.position.x = i;
        road.position.y = 0.05;
        road.receiveShadow = true;
        scene.add(road);
    }
}

// -------------------------------
// BUILDINGS
// -------------------------------
function createBuildings(scene, loader) {
    const gridSpacing = 10;
    for (let x = -90; x <= 90; x += gridSpacing) {
        for (let z = -90; z <= 90; z += gridSpacing) {
            if (x % 10 === 0 || z % 10 === 0) continue;

            const height = 3 + Math.random() * 10;
            const buildingGeo = new THREE.BoxGeometry(4, height, 4);

            // Building textures
            const buildingTexture = loader.load('https://threejs.org/examples/textures/brick_diffuse.jpg');
            const buildingMat = new THREE.MeshStandardMaterial({ map: buildingTexture });

            const building = new THREE.Mesh(buildingGeo, buildingMat);
            building.position.set(x, height / 2, z);
            building.castShadow = true;
            building.receiveShadow = true;
            scene.add(building);
        }
    }
}

// -------------------------------
// STREET LIGHTS
// -------------------------------
function createStreetLights(scene) {
    const lightGeo = new THREE.CylinderGeometry(0.05, 0.05, 5);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const spacing = 20;
    for (let x = -100; x <= 100; x += spacing) {
        for (let z = -100; z <= 100; z += spacing) {
            if (x % 10 === 0 || z % 10 === 0) {
                const pole = new THREE.Mesh(lightGeo, lightMat);
                pole.position.set(x, 2.5, z);
                pole.castShadow = true;
                scene.add(pole);

                const pointLight = new THREE.PointLight(0xffffaa, 0.5, 10);
                pointLight.position.set(x, 5, z);
                pointLight.castShadow = true;
                scene.add(pointLight);
            }
        }
    }
}
