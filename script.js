// --- FONCTION ACCORDÉON ---
function toggleSection(id, headerElement) {
    const content = document.getElementById(id);
    content.classList.toggle('open');
    headerElement.classList.toggle('active');
}

// --- FOND INTERACTIF (PARTICULES) ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particlesArray = [];
const mouse = { x: null, y: null, radius: 170 };

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.2 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 25) + 5;
    }
    draw() {
        ctx.fillStyle = '#d2c1b0';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let dirX = (dx / distance) * force * this.density;
            let dirY = (dy / distance) * force * this.density;
            this.x -= dirX;
            this.y -= dirY;
        } else {
            this.x -= (this.x - this.baseX) * 0.05;
            this.y -= (this.y - this.baseY) * 0.05;
        }
    }
}

function init() {
    particlesArray = [];
    const n = (canvas.width * canvas.height) / 10000;
    for (let i = 0; i < n; i++) {
        particlesArray.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.draw(); p.update(); });
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// --- APPARITION AU SCROLL ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- LOGIQUE DU CURSEUR PERSONNALISÉ ---
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    const follower = document.createElement('div');
    follower.id = 'custom-cursor-follower';
    document.body.appendChild(follower);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Le point suit rapidement
        cursorX += (mouseX - cursorX) * 0.6;
        cursorY += (mouseY - cursorY) * 0.6;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Le cercle suit plus lentement (effet de traîne)
        followerX += (mouseX - followerX) * 0.3;
        followerY += (mouseY - followerY) * 0.3;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Interaction avec les éléments cliquables
    const interactables = document.querySelectorAll('a, button, .section-header, .skill-link, .project-link');

    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });

    // Effet au clic
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});