function setRanges(n,t){xmin=n-window.innerWidth*pixelratio/2;xmax=n+window.innerWidth*pixelratio/2;ymin=t-window.innerHeight*pixelratio/2;ymax=t+window.innerHeight*pixelratio/2}function setRangebyZoom(n,t,i=pixelratio){let r=currentCenter[0]-n,u=currentCenter[1]-t,f=[n+r*i,t+u*i];currentCenter=f}function drawMandelbrot(n,t,i,r){for(let u=0;u<window.innerWidth;u++)for(let f=0;f<window.innerHeight;f++){let s=n+(t-n)*u/window.innerWidth,h=i+(r-i)*f/window.innerHeight,c=new Complex(s,h),o=new Complex(0,0),e=[];for(let n=0;n<100;n++)e.push(o.modulus),o=o.square().add(c);e.at(-1)-e.at(-2)<=e[1]-e[0]&&(ctx.fillStyle="black",ctx.fillRect(u,f,1,1))}}function draw(){setRanges(...currentCenter);document.getElementById("top").innerHTML=ymax;document.getElementById("bottom").innerHTML=ymin;document.getElementById("left").innerHTML=xmin;document.getElementById("right").innerHTML=xmax;document.getElementById("pixel-ratio").innerHTML=pixelratio;ctx.clearRect(0,0,window.innerWidth,window.innerHeight);drawMandelbrot(xmin,xmax,ymin,ymax)}const mask=document.getElementById("mask"),canvas=document.getElementById("canvas");let pixelratio=1/200,xmin,xmax,ymin,ymax,currentCenter=[0,0];canvas.width=window.innerWidth;canvas.height=window.innerHeight;let ctx=canvas.getContext("2d");class Complex{constructor(n,t){this.real=n;this.imag=t;this.modulus=Math.sqrt(Math.abs(this.real)+Math.abs(this.imag))}add(n){return new Complex(this.real+n.real,this.imag+n.imag)}mult(n){return new Complex(this.real*n.real-this.imag*n.imag,this.real*n.imag+this.imag*n.real)}square(){return this.mult(this)}}draw();window.onresize=function(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;draw()};mask.onwheel=function(n){let i=n.clientX,r=n.clientY,u=n.deltaY>0,t;u?(pixelratio*=1.05,t=1.05):(pixelratio/=1.05,t=1/1.05);let f=xmin+(xmax-xmin)*i/window.innerWidth,e=ymin+(ymax-ymin)*r/window.innerHeight;setRangebyZoom(f,e,t);draw()};