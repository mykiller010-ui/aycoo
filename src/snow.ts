interface Drop {
    x: number;
    y: number;

    length: number;
    speed: number;
    width: number;

    alpha: number;
}

export function startSnow(canvas: HTMLCanvasElement): void {

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        canvas.remove();
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    let drops: Drop[] = [];

    // -----------------------------
    // Wind
    // -----------------------------

    let wind = -140;
    let targetWind = -140;
    let windTimer = 0;

    // -----------------------------
    // Lightning
    // -----------------------------

    let flash = 0;
    let nextFlash = 6 + Math.random() * 10;

    // -----------------------------
    // Resize
    // -----------------------------

    function resize() {

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.setTransform(dpr,0,0,dpr,0,0);

        const amount =
            Math.min(
                900,
                Math.round(width * height / 1800)
            );

        drops = [];

        for(let i=0;i<amount;i++){

            drops.push(createDrop(
                Math.random()*width,
                Math.random()*height
            ));

        }

    }

    window.addEventListener("resize",resize);

    resize();

    // -----------------------------
    // Create drop
    // -----------------------------

    function createDrop(x:number,y:number):Drop{

        const depth=Math.random();

        return{

            x,
            y,

            length:
                10+
                depth*18,

            speed:
                500+
                depth*900,

            width:
                .7+
                depth*.9,

            alpha:
                .08+
                depth*.4

        };

    }

    // -----------------------------
    // Time
    // -----------------------------

    let last=performance.now();

    function frame(now:number){

        const dt=Math.min(
            .04,
            (now-last)/1000
        );

        last=now;
              // ----------------------------------
        // WIND
        // ----------------------------------

        windTimer -= dt;

        if (windTimer <= 0) {

            windTimer = 3 + Math.random() * 4;

       targetWind =
    (-120 + Math.random() * 240);

// occasional strong gust
if (Math.random() > 0.75) {
    targetWind *= 2;
}

        }

        wind += (targetWind - wind) * dt * 0.6;

        // ----------------------------------
        // LIGHTNING
        // ----------------------------------

        nextFlash -= dt;

if (nextFlash <= 0) {

    flash = 1;

    // Sometimes create a second flash
    if (Math.random() > 0.45) {
        setTimeout(() => {
            flash = 0.8;
        }, 120);
    }

    // Rare triple flash
    if (Math.random() > 0.8) {
        setTimeout(() => {
            flash = 0.6;
        }, 260);
    }

    nextFlash =
        6 +
        Math.random() * 14;
}

flash *= 0.90;

        // ----------------------------------
        // CLEAR
        // ----------------------------------

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        // ----------------------------------
        // RAIN
        // ----------------------------------

        for (const d of drops) {

            d.x += wind * dt;

            d.y += d.speed * dt;

            if (d.y > height + 40) {

                d.y = -30;

                d.x = Math.random() * width;

            }

            if (d.x < -50)
                d.x = width + 50;

            if (d.x > width + 50)
                d.x = -50;

            ctx.beginPath();

           ctx.lineWidth = d.width;

ctx.shadowBlur = d.width * 2;
ctx.shadowColor = "rgba(180,220,255,.4)";

            ctx.strokeStyle =
                `rgba(185,215,255,${d.alpha})`;

            ctx.moveTo(
                d.x,
                d.y
            );

            ctx.lineTo(

                d.x - wind * 0.03,

                d.y + d.length

            );

            ctx.stroke();
ctx.shadowBlur = 0;
        }

        // ----------------------------------
        // LIGHTNING FLASH
        // ----------------------------------

        if (flash > 0.01) {

            ctx.fillStyle =
                `rgba(255,255,255,${
                  flash * 0.32
                })`;

            ctx.fillRect(
                0,
                0,
                width,
                height
            );

        }
ctx.fillStyle =
    "rgba(15,20,35,.05)";

ctx.fillRect(
    0,
    0,
    width,
    height
);
        requestAnimationFrame(frame);

    }

    requestAnimationFrame(frame);

}
