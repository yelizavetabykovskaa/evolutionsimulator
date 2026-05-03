import { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // ── Noise ──
    const P = new Uint8Array(512);
    for (let i = 0; i < 256; i++) P[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [P[i], P[j]] = [P[j], P[i]];
    }
    for (let i = 0; i < 256; i++) P[i + 256] = P[i];

    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + t * (b - a);
    const grad = (h, x, y) => {
      const v = h & 3;
      return v === 0 ? x + y : v === 1 ? -x + y : v === 2 ? x - y : -x - y;
    };
    function noise(x, y) {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
      x -= Math.floor(x); y -= Math.floor(y);
      const u = fade(x), v = fade(y);
      const a = P[X] + Y, b = P[X + 1] + Y;
      return lerp(
        lerp(grad(P[a], x, y), grad(P[b], x - 1, y), u),
        lerp(grad(P[a + 1], x, y - 1), grad(P[b + 1], x - 1, y - 1), u),
        v
      ) * 0.5 + 0.5;
    }
    function fbm(x, y, oct = 6) {
      let v = 0, amp = 0.5, freq = 1, max = 0;
      for (let i = 0; i < oct; i++) {
        v += noise(x * freq, y * freq) * amp;
        max += amp; amp *= 0.48; freq *= 2.1;
      }
      return v / max;
    }

    // ── Stars ──
    let stars = [];
    function buildStarField() {
      stars = [];
      const N = Math.floor((W * H) / 2600);
      for (let i = 0; i < N; i++) {
        const r = Math.pow(Math.random(), 2.8) * 1.9 + 0.15;
        stars.push({
          x: Math.random() * W, y: Math.random() * H, r,
          a: Math.random() * 0.55 + (r > 1.1 ? 0.45 : 0.15),
          tw: Math.random() * Math.PI * 2,
          twS: Math.random() * 0.7 + 0.15,
          col: Math.random() < 0.07 ? `hsl(${200 + Math.random() * 50},75%,92%)`
             : Math.random() < 0.05 ? `hsl(${28 + Math.random() * 18},70%,92%)`
             : "#e8f4ff",
        });
      }
      [{ cx: W * 0.72, cy: H * 0.14, sp: 80, n: 45 },
       { cx: W * 0.14, cy: H * 0.65, sp: 55, n: 28 }].forEach(cl => {
        for (let i = 0; i < cl.n; i++) {
          const ang = Math.random() * Math.PI * 2;
          const dist = Math.pow(Math.random(), 0.5) * cl.sp;
          stars.push({
            x: cl.cx + Math.cos(ang) * dist, y: cl.cy + Math.sin(ang) * dist,
            r: Math.random() * 1.5 + 0.25, a: Math.random() * 0.65 + 0.3,
            tw: Math.random() * Math.PI * 2, twS: Math.random() * 1.4 + 0.5,
            col: `hsl(${185 + Math.random() * 65},72%,94%)`,
          });
        }
      });
    }

    // ── Nebula (offscreen) ──
    const nebOff = document.createElement("canvas");
    function buildNebula() {
      nebOff.width = W; nebOff.height = H;
      const nc = nebOff.getContext("2d");
      const id = nc.createImageData(W, H);
      const d = id.data;
      const S = 4, sw = Math.ceil(W / S), sh = Math.ceil(H / S);
      const buf = new Float32Array(sw * sh), buf2 = new Float32Array(sw * sh);
      for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) {
        buf[j*sw+i]  = fbm(i/sw*5.2+0.7, j/sh*5.2+1.3, 6);
        buf2[j*sw+i] = fbm(i/sw*4.8+3.1, j/sh*4.8+0.4, 5);
      }
      for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
        const si = Math.min(Math.floor(px/S), sw-1), sj = Math.min(Math.floor(py/S), sh-1);
        const v = buf[sj*sw+si], v2 = buf2[sj*sw+si];
        const dx1=(px/W-0.76)/0.38, dy1=(py/H-0.20)/0.38;
        const m1=Math.max(0,1-dx1*dx1-dy1*dy1);
        const dx2=(px/W-0.10)/0.42, dy2=(py/H-0.52)/0.48;
        const m2=Math.max(0,1-dx2*dx2-dy2*dy2);
        const dx3=(px/W-0.50)/0.55, dy3=(py/H-0.90)/0.28;
        const m3=Math.max(0,1-dx3*dx3-dy3*dy3);
        const dx4=(px/W-0.40)/0.30, dy4=(py/H-0.42)/0.30;
        const m4=Math.max(0,1-dx4*dx4-dy4*dy4);
        const thr=0.44;
        const n1=Math.max(0,(v-thr)/(1-thr)), n2=Math.max(0,(v2-thr)/(1-thr));
        const nn1=n1*n1, nn2=n2*n2;
        const c1=nn1*m1*0.9, c2=nn2*m2*1.0, c3=nn1*m3*0.8, c4=nn2*m4*0.6;
        const idx=(py*W+px)*4;
        d[idx]  =Math.min(255,c1*40 +c2*180+c3*20 +c4*60);
        d[idx+1]=Math.min(255,c1*70 +c2*30 +c3*180+c4*30);
        d[idx+2]=Math.min(255,c1*230+c2*200+c3*210+c4*200);
        d[idx+3]=Math.min(255,(c1+c2+c3+c4)*255*0.52);
      }
      nc.putImageData(id, 0, 0);
    }

    // ── Black hole ──
    let bhRot = 0;
    function drawBlackHole() {
      const cx = W*0.79, cy = H*0.25, r = Math.min(W,H)*0.055;
      const ag = ctx.createRadialGradient(cx,cy,r,cx,cy,r*6.5);
      ag.addColorStop(0,"rgba(120,60,220,0)");
      ag.addColorStop(0.15,"rgba(90,40,180,0.09)");
      ag.addColorStop(0.4,"rgba(60,20,130,0.12)");
      ag.addColorStop(0.7,"rgba(30,10,80,0.07)");
      ag.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=ag; ctx.beginPath(); ctx.arc(cx,cy,r*6.5,0,Math.PI*2); ctx.fill();

      ctx.save();
      ctx.strokeStyle="rgba(200,150,255,0.28)"; ctx.lineWidth=2;
      ctx.shadowColor="rgba(200,140,255,0.95)"; ctx.shadowBlur=22;
      ctx.beginPath(); ctx.arc(cx,cy,r*1.55,0,Math.PI*2); ctx.stroke();
      ctx.restore();

      ctx.save(); ctx.translate(cx,cy); ctx.rotate(bhRot);
      [{rMul:1.85,wMul:0.32,alpha:0.65,c1:"255,195,70",c2:"255,110,25"},
       {rMul:2.45,wMul:0.28,alpha:0.42,c1:"255,155,50",c2:"200,70,15"},
       {rMul:3.10,wMul:0.22,alpha:0.22,c1:"200,110,35",c2:"150,50,10"},
       {rMul:3.75,wMul:0.16,alpha:0.10,c1:"150,70,20", c2:"90,25,5"}].forEach(({rMul,wMul,alpha,c1,c2})=>{
        ctx.save(); ctx.scale(1,0.26);
        const dr=r*rMul, dw=r*wMul;
        const dg=ctx.createRadialGradient(0,0,dr-dw,0,0,dr+dw);
        dg.addColorStop(0,`rgba(${c2},0)`);
        dg.addColorStop(0.4,`rgba(${c1},${alpha})`);
        dg.addColorStop(0.6,`rgba(${c1},${alpha})`);
        dg.addColorStop(1,`rgba(${c2},0)`);
        ctx.strokeStyle=dg; ctx.lineWidth=dw*2;
        ctx.beginPath(); ctx.arc(0,0,dr,0,Math.PI*2); ctx.stroke();
        ctx.restore();
      });
      ctx.restore();

      [-1,1].forEach(sign=>{
        const jLen=r*8.5, jw=r*0.18;
        ctx.save(); ctx.translate(cx,cy+sign*r*1.1);
        const wg=ctx.createLinearGradient(-jw*2,0,jw*2,0);
        wg.addColorStop(0,"rgba(0,0,0,0)");
        wg.addColorStop(0.5,`rgba(180,120,255,${sign>0?0.2:0.25})`);
        wg.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=wg; ctx.fillRect(-jw*2,0,jw*4,sign*jLen);
        ctx.restore();
      });

      const eh=ctx.createRadialGradient(cx-r*0.28,cy-r*0.28,0,cx,cy,r);
      eh.addColorStop(0,"#100818"); eh.addColorStop(0.65,"#040208"); eh.addColorStop(1,"#000000");
      ctx.fillStyle=eh; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();

      ctx.save();
      ctx.strokeStyle="rgba(255,210,100,0.55)"; ctx.lineWidth=1.4;
      ctx.shadowColor="rgba(255,185,60,0.9)"; ctx.shadowBlur=12;
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    }

    // ── Pulsars ──
    const pulsarDefs = [
      {xR:0.18,yR:0.11,ph:0,  sp:1.9,hue:175},
      {xR:0.92,yR:0.80,ph:2.2,sp:2.7,hue:275},
      {xR:0.55,yR:0.95,ph:1.1,sp:1.4,hue:200},
    ];
    function drawPulsars(t) {
      pulsarDefs.forEach(p=>{
        const px=W*p.xR, py=H*p.yR;
        const pulse=Math.pow(Math.max(0,Math.sin(t*p.sp+p.ph)),10);
        if(pulse<0.005) return;
        for(let i=3;i>=0;i--){
          ctx.beginPath(); ctx.arc(px,py,(i+1)*24*pulse,0,Math.PI*2);
          ctx.fillStyle=`hsla(${p.hue},88%,78%,${pulse*[0.5,0.28,0.12,0.05][i]})`; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(px,py,2.8,0,Math.PI*2);
        ctx.fillStyle=`hsla(${p.hue},80%,97%,${0.55+pulse*0.45})`; ctx.fill();
      });
    }

    // ── Shoots ──
    function newShoot(){
      return{x:Math.random()*W*1.4-W*0.2,y:Math.random()*H*0.45-H*0.05,
        vx:(Math.random()*0.6+0.5)*(Math.random()<0.55?1:-1),vy:Math.random()*0.32+0.12,
        len:Math.random()*200+90,life:0,maxLife:Math.random()*90+40,
        delay:Math.random()*500,timer:0,active:Math.random()>0.65,
        alpha:Math.random()*0.55+0.4,width:Math.random()*1.6+0.5};
    }
    const shoots=Array.from({length:7},newShoot);
    function drawShoots(){
      shoots.forEach((s,idx)=>{
        if(!s.active){if(++s.timer>s.delay){shoots[idx]=newShoot();shoots[idx].active=true;}return;}
        s.life++;s.x+=s.vx*5;s.y+=s.vy*5;
        if(s.life>s.maxLife||s.x<-300||s.x>W+300||s.y>H+100){s.active=false;s.timer=0;s.delay=Math.random()*280+60;return;}
        const p=s.life/s.maxLife;
        const fade=p<0.18?p/0.18:p>0.72?1-(p-0.72)/0.28:1;
        const ex=s.x-s.vx*s.len,ey=s.y-s.vy*s.len;
        const sg=ctx.createLinearGradient(ex,ey,s.x,s.y);
        sg.addColorStop(0,"transparent");
        sg.addColorStop(0.55,`rgba(170,215,255,${s.alpha*fade*0.4})`);
        sg.addColorStop(1,`rgba(220,240,255,${s.alpha*fade})`);
        ctx.strokeStyle=sg;ctx.lineWidth=s.width;
        ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(s.x,s.y);ctx.stroke();
        ctx.beginPath();ctx.arc(s.x,s.y,s.width*2,0,Math.PI*2);
        ctx.fillStyle=`rgba(240,248,255,${fade*s.alpha*0.9})`;ctx.fill();
      });
    }

    function drawBand(){
      ctx.save();ctx.translate(W*0.5,H*0.5);ctx.rotate(-0.4);
      const b=ctx.createLinearGradient(0,-H*0.8,0,H*0.8);
      b.addColorStop(0,"transparent");
      b.addColorStop(0.28,"rgba(25,45,95,0.05)");
      b.addColorStop(0.44,"rgba(55,85,155,0.09)");
      b.addColorStop(0.50,"rgba(75,115,190,0.115)");
      b.addColorStop(0.56,"rgba(55,85,155,0.09)");
      b.addColorStop(0.72,"rgba(25,45,95,0.05)");
      b.addColorStop(1,"transparent");
      ctx.fillStyle=b;ctx.fillRect(-W,-H,W*2,H*2);ctx.restore();
    }

    function drawStars(time){
      stars.forEach(s=>{
        const tw=Math.sin(time*s.twS+s.tw)*0.3+0.7;
        ctx.globalAlpha=s.a*tw;ctx.fillStyle=s.col;
        if(s.r>1.15){
          ctx.save();ctx.globalAlpha=s.a*tw*0.3;ctx.strokeStyle=s.col;ctx.lineWidth=0.6;
          const sp=s.r*5.5;
          ctx.beginPath();ctx.moveTo(s.x-sp,s.y);ctx.lineTo(s.x+sp,s.y);
          ctx.moveTo(s.x,s.y-sp);ctx.lineTo(s.x,s.y+sp);ctx.stroke();ctx.restore();
          ctx.globalAlpha=s.a*tw;
        }
        ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
      });
      ctx.globalAlpha=1;
    }

    // ── Init ──
    buildStarField();
    buildNebula();

    const resize=()=>{
      W=canvas.width=window.innerWidth;
      H=canvas.height=window.innerHeight;
      buildStarField();
      buildNebula();
    };
    window.addEventListener("resize",resize);

    function draw(ts){
      const t=ts/1000;
      bhRot=t*0.11;
      ctx.fillStyle="#010409";ctx.fillRect(0,0,W,H);
      drawBand();
      ctx.drawImage(nebOff,0,0);
      drawStars(t);
      drawBlackHole();
      drawPulsars(t);
      drawShoots();
      animId=requestAnimationFrame(draw);
    }
    animId=requestAnimationFrame(draw);

    return()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",resize);};
  },[]);

  return(
    <canvas ref={canvasRef} style={{
      position:"fixed",inset:0,zIndex:0,pointerEvents:"none",display:"block"
    }}/>
  );
}