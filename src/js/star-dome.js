
import * as THREE from 'three';

function calculateDistance(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z);
}

function getRandomStarColor() {
    const colors = [
        0xFFFAFA, // White
        0xFFFACD, // Lemon Chiffon (light yellow)
        0xFFE4B5, // Moccasin (slightly darker yellow)
        0xFFD700, // Gold (darker yellow)
        0xFF8C00, // Dark Orange (orange/red)
        0xFF4500, // Orange Red (red)
        0xFF0000  // Red
    ];
    
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function addStar(scene, minSize = .3, maxSize = .5, maxStarScatterDistance = 700) {

    const starColor = getRandomStarColor();

    const exclusionZone = maxStarScatterDistance / 2;
    const geometry = new THREE.SphereGeometry(THREE.MathUtils.randFloat(minSize, maxSize), 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: starColor, emissive: starColor })
    const star = new THREE.Mesh(geometry, material);

    let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloat(-1 * maxStarScatterDistance, maxStarScatterDistance));

    /** recalculate X,Y,Z untill a proper posistion is found */
    while (true) {
        let distance = calculateDistance(x, y, z)
        let isBlockingEntrance = (x < maxStarScatterDistance && y < maxStarScatterDistance && z > exclusionZone * .7);
        /* recalculate position if position is, 
            1. in exclusion zone
            2. outside max space
            3. blocking the camera entrance  */
        if (distance < exclusionZone || distance > (maxStarScatterDistance * .75) || isBlockingEntrance) {
            [x, y, z] = Array(3).fill().map(() => (THREE.MathUtils.randFloat(-1 * maxStarScatterDistance * 0.99999, maxStarScatterDistance * 0.99999) * 0.99999));
        } else
            break;
    }

    star.position.set(x, y, z);
    scene.add(star)
}

function generateStarDome(scene, minSize, maxSize, starCount = 3000, maxStarScatterDistance) {

    const _fnDraw = function () {
        addStar(scene, minSize, maxSize, maxStarScatterDistance)
    }
    Array(starCount).fill().forEach(_fnDraw);
}

export { generateStarDome };