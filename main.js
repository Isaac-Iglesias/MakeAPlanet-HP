// Use global THREE (from CDN script tag)
const THREE = window.THREE;

// Constants
const CANVAS_CONTAINER = document.getElementById('canvas-container');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
CANVAS_CONTAINER.appendChild(renderer.domElement);

// Planet Textures (Loaded from main-textures.js to bypass local CORS)
const textureKeys = Object.keys(TEXTURE_DATA);
const randomKey = textureKeys[Math.floor(Math.random() * textureKeys.length)];
const selectedTextureData = TEXTURE_DATA[randomKey];

// Planet with Texture
const textureLoader = new THREE.TextureLoader();
const planetTexture = textureLoader.load(selectedTextureData);

const planetGeometry = new THREE.SphereGeometry(2, 64, 64);
const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
    color: 0xffffff, // White to show full texture colors
    roughness: 0.8,
    metalness: 0.2,
});
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// Atmosphere glow (Subtle)
const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.05,
    side: THREE.BackSide
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

// Multi-layered Starfield (Cosmic Depth)
function createStarfield(count, size, opacity) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ size, color: 0xffffff, transparent: true, opacity });
    return new THREE.Points(geometry, material);
}

const starLayer1 = createStarfield(3000, 0.05, 0.8); // Foreground
const starLayer2 = createStarfield(2000, 0.03, 0.4); // Midground
const starLayer3 = createStarfield(1000, 0.02, 0.2); // Background
scene.add(starLayer1, starLayer2, starLayer3);

// Interactive lights (Subtle Cursor Glow)
const hoverLight = new THREE.PointLight(0xffffff, 0, 10);
scene.add(hoverLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

let mouseX = 0;
let mouseY = 0;
let targetPosX = 0;
let targetPosY = 0;
let rotationSpeed = 0.002;

// Audio Setup (Subtle Ambient Space Drone)
let audioContext;
function startAmbientDrone() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, audioContext.currentTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, audioContext.currentTime);
    filter.Q.setValueAtTime(10, audioContext.currentTime);
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.015, audioContext.currentTime + 3);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
}

window.addEventListener('mousemove', (event) => {
    // Normalize mouse pos
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Start audio on first move if not started
    if (!audioContext) startAmbientDrone();

    // Position light slightly in front of cursor in 3D space
    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    hoverLight.position.set(pos.x, pos.y, 2); // Closer to surface
    hoverLight.intensity = 1.5; // Stronger impact
});

window.addEventListener('click', () => {
    if (!audioContext) startAmbientDrone();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Safety: ensure mouse values are numbers before calculating
    if (isNaN(mouseX)) mouseX = 0;
    if (isNaN(mouseY)) mouseY = 0;

    // Smooth rotation follow
    targetPosX += (mouseX - targetPosX) * 0.05;
    targetPosY += (mouseY - targetPosY) * 0.05;

    // Faster rotation on mouse movement
    const movementMag = Math.abs(mouseX) + Math.abs(mouseY);
    const dynamicRotation = rotationSpeed + (movementMag * 0.005);
    planet.rotation.y += dynamicRotation;

    // Subtle parallax tilt
    planet.rotation.x = targetPosY * 0.2;
    planet.rotation.z = -targetPosX * 0.1;

    // Atmospheric follow
    atmosphere.rotation.y = planet.rotation.y;
    atmosphere.rotation.x = planet.rotation.x;

    // Starfield Parallax
    starLayer1.rotation.y += dynamicRotation * 0.1;
    starLayer1.position.x = -targetPosX * 0.5;
    starLayer1.position.y = -targetPosY * 0.5;

    starLayer2.rotation.y += dynamicRotation * 0.05;
    starLayer2.position.x = -targetPosX * 0.2;
    starLayer2.position.y = -targetPosY * 0.2;

    starLayer3.rotation.y += dynamicRotation * 0.02;
    starLayer3.position.x = -targetPosX * 0.1;
    starLayer3.position.y = -targetPosY * 0.1;

    // Responsiveness
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        camera.fov = 45;
        camera.position.set(0, 0, 15);
        const targetPoint = new THREE.Vector3(0, -1.5, 0);
        camera.lookAt(targetPoint);

        // Intensity adjust for mobile touch
        hoverLight.intensity = 0.5;
    } else {
        camera.fov = 35;
        camera.position.set(0, 0, 12);

        const lookOffset = camera.aspect * 1.8;
        const targetPoint = new THREE.Vector3(-lookOffset, 0, 0);
        camera.lookAt(targetPoint);
    }

    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
}

animate();

// Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// Intersection Observer for scroll transitions
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-section').forEach(section => {
    observer.observe(section);
});
