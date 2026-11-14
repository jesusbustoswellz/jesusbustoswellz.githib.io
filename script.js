// 1. SOBRE INICIAL + MÚSICA AUTOMÁTICA + BOTÓN SILENCIO
const pantallaSobre = document.getElementById("pantallaSobre");
const sobre3d = document.getElementById("sobre3d");
const btnAbrir = document.getElementById("btnAbrir");
const btnSilencio = document.getElementById("btnSilencio");
const audio = document.getElementById("audioFondo");

window.addEventListener("load", () => {
    audio.play().catch(() => {});
});

btnAbrir.addEventListener("click", () => {
    sobre3d.classList.add("abriendo");
    audio.muted = false;
    audio.play().catch(() => {});
    btnSilencio.innerText = "🔊";

    setTimeout(() => {
        pantallaSobre.classList.add("oculto");
        lanzarChispas(canvas.width / 2, canvas.height / 2, 80);
    }, 550);
});

btnSilencio.addEventListener("click", () => {
    if (audio.paused) {
        audio.play().catch(() => {});
        audio.muted = false;
        btnSilencio.innerText = "🔊";
    } else {
        audio.muted = !audio.muted;
        btnSilencio.innerText = audio.muted ? "🔇" : "🔊";
    }
});

// 2. EFECTO CINEMATOGRÁFICO AL HACER SCROLL (ZOOM + ATMÓSFERA)
const heroParallax = document.getElementById("heroParallax");
const barraTop = document.getElementById("barraTop");
const escenas = document.querySelectorAll(".escena");

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const altTotal = document.documentElement.scrollHeight - window.innerHeight;
    
    const progreso = altTotal > 0 ? (scrollY / altTotal) * 100 : 0;
    barraTop.style.width = `${progreso}%`;

    if (scrollY < window.innerHeight) {
        const escala = 1 + scrollY * 0.00045;
        const opacidad = 1 - scrollY / (window.innerHeight * 0.85);
        heroParallax.style.transform = `scale(${escala}) translateY(${scrollY * 0.25}px)`;
        heroParallax.style.opacity = Math.max(0, opacidad);
    }

    escenas.forEach(escena => {
        const rect = escena.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
            const tema = escena.getAttribute("data-bg");
            if (tema) {
                document.body.className = `bg-${tema}`;
            }
        }
    });
});

// 3. CONSTRUCCIÓN Y DESCONSTRUCCIÓN BIDIRECCIONAL AL SUBIR/BAJAR
const observadorMagico = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            // Al bajar: se construye
            if (!entrada.target.classList.contains("construido")) {
                entrada.target.classList.add("construido");
                const rect = entrada.target.getBoundingClientRect();
                lanzarChispas(rect.left + rect.width / 2, Math.max(100, rect.top + 100), 30);
            }
        } else {
            // Al subir (sale de pantalla por arriba o abajo): se desconstruye a su estado base
            entrada.target.classList.remove("construido");
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".bloque-magico").forEach(bloque => {
    observadorMagico.observe(bloque);
});

// 4. PERGAMINO INTERACTIVO
const pergamino = document.getElementById("pergaminoInteractivo");
pergamino.addEventListener("click", () => {
    pergamino.classList.toggle("abierto");
    const rect = pergamino.getBoundingClientRect();
    lanzarChispas(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
});

// 5. CUENTA REGRESIVA EN VIVO
const fechaEvento = new Date("November 20, 2026 16:00:00").getTime();

setInterval(() => {
    const ahora = new Date().getTime();
    const diferencia = fechaEvento - ahora;

    if (diferencia <= 0) {
        document.getElementById("cuentaRegresiva").innerHTML = "<span>¡HOY ES EL GRAN DÍA!</span>";
        return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById("dias").innerText = dias.toString().padStart(2, '0');
    document.getElementById("horas").innerText = horas.toString().padStart(2, '0');
    document.getElementById("minutos").innerText = minutos.toString().padStart(2, '0');
    document.getElementById("segundos").innerText = segundos.toString().padStart(2, '0');
}, 1000);

// 6. PASTEL Y WHATSAPP
document.getElementById("imgPastel").addEventListener("click", (e) => {
    const rect = e.target.getBoundingClientRect();
    lanzarChispas(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
});

document.getElementById("formWhatsapp").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreInvitado").value.trim();
    const respuesta = document.getElementById("respuestaAsistencia").value;
    
    // CAMBIA ESTE NÚMERO POR TU WHATSAPP REAL (591 + número)
    const telefonoDestino = "59170000000"; 
    
    const texto = `Hola, soy *${nombre}*. Confirmo sobre el cumpleaños de Megan Miranda: ${respuesta}`;
    const url = `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(texto)}`;
    
    lanzarChispas(canvas.width / 2, canvas.height / 2, 90);
    window.open(url, "_blank");
});

// 7. MOTOR DE PARTÍCULAS Y CHISPAS
const canvas = document.getElementById("canvasParticulas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let particulas = [];
const colores = ["#ffd700", "#2bc0e4", "#ff5e8e", "#a5f3fc", "#ffffff"];

for (let i = 0; i < 35; i++) {
    particulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.7 - 0.2,
        color: "rgba(43, 192, 228, 0.5)",
        esChispa: false
    });
}

function lanzarChispas(origenX, origenY, cantidad) {
    for (let i = 0; i < cantidad; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const velocidad = Math.random() * 6 + 2;
        particulas.push({
            x: origenX,
            y: origenY,
            r: Math.random() * 4 + 1.5,
            vx: Math.cos(angulo) * velocidad,
            vy: Math.sin(angulo) * velocidad - 1.5,
            color: colores[Math.floor(Math.random() * colores.length)],
            esChispa: true,
            vida: 75
        });
    }
}

function animarParticulas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particulas.length - 1; i >= 0; i--) {
        let p = particulas[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.esChispa) {
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.vida--;
            if (p.vida <= 0) {
                particulas.splice(i, 1);
                continue;
            }
        } else {
            if (p.y < 0) p.y = canvas.height;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
        }

        ctx.save();
        if (p.esChispa) {
            ctx.globalAlpha = Math.max(0, p.vida / 75);
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
    }
    requestAnimationFrame(animarParticulas);
}

animarParticulas();