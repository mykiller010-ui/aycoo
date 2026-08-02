// src/snow.ts
// Storm system scaffold

export interface Drop {
  x:number;
  y:number;
  length:number;
  speed:number;
  width:number;
  alpha:number;
}

export function startSnow(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if(!ctx) return;

  let w=0,h=0;
  let drops:Drop[]=[];
  let wind=-140,targetWind=-140,windTimer=0;
  let flash=0,nextFlash=6+Math.random()*10;

  function createDrop(x:number,y:number):Drop{
    const d=Math.random();
    return {
      x,y,
      length:10+d*18,
      speed:500+d*900,
      width:0.7+d*0.9,
      alpha:0.08+d*0.4
    };
  }

  function resize(){
    const dpr=Math.min(devicePixelRatio||1,2);
    w=innerWidth; h=innerHeight;
    canvas.width=w*dpr; canvas.height=h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    drops=Array.from({length:Math.min(900,Math.round(w*h/1800))},
      ()=>createDrop(Math.random()*w,Math.random()*h));
  }
  addEventListener("resize",resize);
  resize();

  let last=performance.now();
  function frame(now:number){
    const dt=Math.min(.04,(now-last)/1000); last=now;

    windTimer-=dt;
    if(windTimer<=0){
      windTimer=3+Math.random()*4;
      targetWind=(-120+Math.random()*240);
      if(Math.random()>0.75) targetWind*=2;
    }
    wind+=(targetWind-wind)*dt*0.6;

    nextFlash-=dt;
    if(nextFlash<=0){
      flash=1;
      nextFlash=6+Math.random()*14;
    }
    flash*=0.9;

    ctx.clearRect(0,0,w,h);

    for(const d of drops){
      d.x+=wind*dt;
      d.y+=d.speed*dt;
      if(d.y>h+40){ d.y=-30; d.x=Math.random()*w; }
      if(d.x<-50)d.x=w+50;
      if(d.x>w+50)d.x=-50;

      ctx.beginPath();
      ctx.lineWidth=d.width;
      ctx.strokeStyle=`rgba(185,215,255,${d.alpha})`;
      ctx.moveTo(d.x,d.y);
      ctx.lineTo(d.x-wind*0.03,d.y+d.length);
      ctx.stroke();
    }

    if(flash>0.01){
      ctx.fillStyle=`rgba(255,255,255,${flash*0.3})`;
      ctx.fillRect(0,0,w,h);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
