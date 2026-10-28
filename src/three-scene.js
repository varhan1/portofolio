/**
 * Three.js Hero Scene — Glowing Particle Field
 * Creates an elegant, interactive particle system with floating geometry
 */
import * as THREE from 'three';

export function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return null;

  // Check WebGL support
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported — falling back to CSS background');
      canvas.style.display = 'none';
      return null;
    }
  } catch (e) {
    canvas.style.display = 'none';
    return null;
  }

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ===== RESPONSIVE PARTICLE COUNT =====
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;
  const particleCount = isMobile ? 600 : isTablet ? 1000 : 1800;
  const geometryCount = isMobile ? 4 : isTablet ? 6 : 10;

  // ===== PARTICLE SYSTEM =====
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const velocities = new Float32Array(particleCount * 3);

  const colorIndigo = new THREE.Color(0x6366f1);
  const colorCyan = new THREE.Color(0x06b6d4);
  const colorWhite = new THREE.Color(0xc7d2fe);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // Distribute particles in a spherical volume
    const radius = 25 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Slow random velocities
    velocities[i3] = (Math.random() - 0.5) * 0.008;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;

    // Random color from palette
    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.4) color = colorIndigo;
    else if (colorChoice < 0.75) color = colorCyan;
    else color = colorWhite;

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = Math.random() * 2.5 + 0.8;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Custom shader material for glowing particles
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uPixelRatio;

      void main() {
        vColor = color;
        vec3 pos = position;

        // Gentle floating motion
        pos.x += sin(uTime * 0.3 + position.y * 0.1) * 0.5;
        pos.y += cos(uTime * 0.2 + position.x * 0.1) * 0.5;
        pos.z += sin(uTime * 0.15 + position.z * 0.05) * 0.3;

        // Mouse influence
        float mouseInfluence = 1.0 / (1.0 + length(pos.xy - uMouse * 20.0) * 0.08);
        pos.xy += normalize(pos.xy - uMouse * 20.0) * mouseInfluence * 1.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float sizeAttenuation = 300.0 / (-mvPosition.z);
        gl_PointSize = size * sizeAttenuation * uPixelRatio;

        vAlpha = smoothstep(0.0, 0.3, size / 3.3) * (0.6 + 0.4 * sin(uTime + position.x));
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        glow = pow(glow, 1.8);

        gl_FragColor = vec4(vColor, glow * vAlpha * 0.8);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
  scene.add(particleSystem);

  // ===== FLOATING GEOMETRY =====
  const geometryGroup = new THREE.Group();
  scene.add(geometryGroup);

  const geometries = [
    new THREE.IcosahedronGeometry(0.6, 0),
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.TetrahedronGeometry(0.5, 0),
    new THREE.TorusGeometry(0.4, 0.15, 8, 16),
    new THREE.DodecahedronGeometry(0.4, 0),
  ];

  const floatingMeshes = [];
  for (let i = 0; i < geometryCount; i++) {
    const geo = geometries[i % geometries.length];
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x6366f1 : 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.2 + Math.random() * 0.15,
    });

    const mesh = new THREE.Mesh(geo, mat);
    const spread = isMobile ? 15 : 25;
    mesh.position.set(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * 15
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    mesh.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.005,
      },
      floatSpeed: 0.3 + Math.random() * 0.5,
      floatAmplitude: 0.3 + Math.random() * 0.5,
      initialY: mesh.position.y,
    };

    geometryGroup.add(mesh);
    floatingMeshes.push(mesh);
  }

  // ===== CONNECTION LINES =====
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.06,
  });

  const connectionLines = [];
  const maxConnections = isMobile ? 3 : 6;

  for (let i = 0; i < Math.min(maxConnections, floatingMeshes.length - 1); i++) {
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const line = new THREE.Line(lineGeo, lineMaterial);
    scene.add(line);
    connectionLines.push({
      line,
      meshA: floatingMeshes[i],
      meshB: floatingMeshes[i + 1],
    });
  }

  // ===== MOUSE TRACKING =====
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  function onMouseMove(event) {
    mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onTouchMove(event) {
    if (event.touches.length > 0) {
      mouse.targetX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // ===== RESIZE HANDLER =====
  function onResize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    particleMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  }

  window.addEventListener('resize', onResize, { passive: true });

  // ===== ANIMATION LOOP =====
  let animationId = null;
  let isTabActive = true;
  const clock = new THREE.Clock();

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (!isTabActive || prefersReducedMotion) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Update particle shader uniforms
    particleMaterial.uniforms.uTime.value = elapsedTime;
    particleMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);

    // Slow rotation of entire particle system
    particleSystem.rotation.y = elapsedTime * 0.02;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.01) * 0.1;

    // Animate floating geometry
    floatingMeshes.forEach((mesh) => {
      const { rotationSpeed, floatSpeed, floatAmplitude, initialY } = mesh.userData;
      mesh.rotation.x += rotationSpeed.x;
      mesh.rotation.y += rotationSpeed.y;
      mesh.rotation.z += rotationSpeed.z;
      mesh.position.y = initialY + Math.sin(elapsedTime * floatSpeed) * floatAmplitude;
    });

    // Update connection lines
    connectionLines.forEach(({ line, meshA, meshB }) => {
      const posArray = line.geometry.attributes.position.array;
      posArray[0] = meshA.position.x;
      posArray[1] = meshA.position.y;
      posArray[2] = meshA.position.z;
      posArray[3] = meshB.position.x;
      posArray[4] = meshB.position.y;
      posArray[5] = meshB.position.z;
      line.geometry.attributes.position.needsUpdate = true;
    });

    // Subtle camera movement based on mouse
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.01;
    camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.01;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // ===== VISIBILITY API =====
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive) {
      clock.start();
    }
  });

  // Start animation
  animate();

  // Return cleanup function
  return {
    dispose() {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particleMaterial.dispose();
      floatingMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    },
  };
}
