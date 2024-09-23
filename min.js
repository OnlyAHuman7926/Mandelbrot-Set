const escapeRadius=4,mask=document.getElementById("mask"),canvas=document.getElementById("canvas");let xmin,xmax,ymin,ymax,pixelratio=.005,currentCenter=[0,0];canvas.width=window.innerWidth,canvas.height=window.innerHeight;let ctx=canvas.getContext("2d");class Complex{constructor(n,e){this.real=n,this.imag=e,this.modulus=Math.sqrt(Math.abs(this.real)+Math.abs(this.imag))}add(n){return new Complex(this.real+n.real,this.imag+n.imag)}mult(n){return new Complex(this.real*n.real-this.imag*n.imag,this.real*n.imag+this.imag*n.real)}square(){return this.mult(this)}}function setRanges(n,e){xmin=n-window.innerWidth*pixelratio/2,xmax=n+window.innerWidth*pixelratio/2,ymin=e-window.innerHeight*pixelratio/2,ymax=e+window.innerHeight*pixelratio/2}function setRangebyZoom(n,e,i=pixelratio){let t=currentCenter[0]-n,r=currentCenter[1]-e;currentCenter=[n+t*i,e+r*i]}function drawMandelbrot(n,e,i,t){for(let r=0;r<window.innerWidth;r+=1)for(let a=0;a<window.innerHeight;a+=1){let o,m,l=n+(e-n)*r/window.innerWidth,d=i+(t-i)*a/window.innerHeight,[w,c]=(new Complex(l,d),new Complex(0,0),[0,0]),s=!0;for(o=0;o<100;o++)if([w,c]=[w**2-c**2+l,2*w*c+d],w**2+c**2>=16){s=!1;break}m=o/100*255,ctx.fillStyle=o<100?`rgb(${m} ${m} ${m} / ${o}%)`:"black",ctx.fillRect(r,a,1,1)}}function draw(){setRanges(...currentCenter),document.getElementById("top").innerHTML=ymax,document.getElementById("bottom").innerHTML=ymin,document.getElementById("left").innerHTML=xmin,document.getElementById("right").innerHTML=xmax,document.getElementById("pixel-ratio").innerHTML=pixelratio,ctx.clearRect(0,0,window.innerWidth,window.innerHeight),drawMandelbrot(xmin,xmax,ymin,ymax)}draw(),window.onresize=function(){canvas.width=window.innerWidth,canvas.height=window.innerHeight,draw()},mask.onwheel=function(n){let e,i=n.clientX,t=n.clientY;n.deltaY>0?(pixelratio*=1.25,e=1.25):(pixelratio/=1.25,e=.8),setRangebyZoom(xmin+(xmax-xmin)*i/window.innerWidth,ymin+(ymax-ymin)*t/window.innerHeight,e),draw()},mask.onpointerdown=function(n){let e=n.clientX,i=n.clientY,t=[];mask.onpointermove=function(n){n.clientX,n.clientY;let r=xmin+(xmax-xmin)*e/window.innerWidth,a=ymin+(ymax-ymin)*i/window.innerWidth;t=[currentCenter[0]+r,currentCenter[1]+a],setRanges(...t),draw()},mask.onpointerup=function(n){currentCenter=t,mask.onpointermove=null,mask.onpointerup=null}};