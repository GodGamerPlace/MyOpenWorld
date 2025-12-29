// ===============================
// WORLD / CITY GENERATOR
// ===============================

function createWorld(scene) {

    const world = {};

    // -------------------------------
    // GROUND
    // -------------------------------
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({
        color: 0x2e8b57 // green
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // -------------------------------
    // ROADS
    // -------------------------------
    const roadMat = new THREE.MeshStandardMaterial({
        color: 0x333333
    });

    const roadWidth = 6;
    const blockSize = 20;
    const citySize = 100;

    for (let i = -citySize; i <= citySize; i += blockSize) {

        // Horizontal roads
        const hRoadGeo = new THREE.BoxGeometry(citySize * 2, 0.1, roadWidth);
        const hRoad = new THREE.Mesh(hRoadGeo, roadMat);
        hRoad.position.set(0, 0.05, i);
        scene.add(hRoad);

        // Vertical roads
        const vRoadGeo = new THREE.BoxGeometry(roadWidth, 0.1, citySize * 2);
        const vRoad = new THREE.Mesh(vRoadGeo, roadMat);
        vRoad.position.set(i, 0.05, 0);
        scene.add(vRoad);
    }

    // -------------------------------
    // BUILDINGS
    // -------------------------------
    const buildingColors = [
        0x8b8b8b,
        0xa0522d,
        0x708090,
        0x696969
    ];

    for (let x = -citySize + blockSize; x < citySize; x += blockSize) {
        for (let z = -citySize + blockSize; z < citySize; z += blockSize) {

            // Skip road intersections
            if (Math.random() < 0.3) continue;

            const width = 6 + Math.random() * 6;
            const depth = 6 + Math.random() * 6;
            const height = 6 + Math.random() * 20;

            const buildingGeo = new THREE.BoxGeometry(width, height, depth);
            const buildingMat = new THREE.MeshStandardMaterial({
                color: buildingColors[
                    Math.floor(Math.random() * buildingColors.length)
                ]
            });

            const building = new THREE.Mesh(buildingGeo, buildingMat);
            building.position.set(
                x + (Math.random() * 4 - 2),
                height / 2,
                z + (Math.random() * 4 - 2)
            );

            scene.add(building);
        }
    }

    // -------------------------------
    // WORLD INFO
    // -------------------------------
    world.size = 200;
    world.type = "mini-open-city";

    return world;
}
