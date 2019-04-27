//属性   线宽   端点  颜色  边数   角数   橡皮大小  canvas宽高   history  画布环境
//方法   画线  铅笔   多边形  圆   矩形   多角形
//     橡皮   裁切   文字   新建   保存  导入图片
function Palette(canvas,mask){
	this.canvas=canvas;
	this.mask=mask;
	this.ctx=this.canvas.getContext('2d');
	this.linewidth=5;
	this.cap='butt';
	this.fillStyle='black';
	this.strokeStyle='black';
	this.cw=this.canvas.width;
	this.ch=this.canvas.height;
	this.history=[];
	this.style='stroke';
	this.bian=6;
}
Palette.prototype={
	init:function(){
		this.ctx.lineWidth=this.linewidth;
		this.ctx.fillStyle=this.fillStyle;
		this.ctx.strokeStyle=this.strokeStyle;
		this.ctx.lineCap=this.cap;
	},
	line:function(ox,oy,cx,cy){				
		this.ctx.beginPath();
		this.ctx.moveTo(ox,oy);
		this.ctx.lineTo(cx,cy);
		this.ctx.stroke();
	},
	poly:function(ox,oy,cx,cy,r,ang){
		this.ctx.beginPath();
		this.ctx.moveTo(ox+r,oy);
		for(let i=1;i<this.bian;i++){
			this.ctx.lineTo(ox+r*Math.cos(ang*i),oy+r*Math.sin(ang*i));
		}
		this.ctx.closePath();
		this.ctx[this.style]();
	},
	polyAngle:function(ox,oy,cx,cy){
		let r=Math.sqrt(Math.pow(cx-ox,2)+Math.pow(cy-oy,2));
		let r1=r/2;
		let ang=360/(this.bian*2)/180*Math.PI;
		this.ctx.beginPath();
		this.ctx.moveTo(ox+r,oy);
		for(let i=1;i<this.bian*2;i++){
			if(i%2==1){
				this.ctx.lineTo(ox+r1*Math.cos(ang*i),oy+r1*Math.sin(ang*i));
			}else{
				this.ctx.lineTo(ox+r*Math.cos(ang*i),oy+r*Math.sin(ang*i));
			}					
		}
		this.ctx.closePath();
		this.ctx[this.style]();
	},
	circle:function(ox,oy,cx,cy,r){
		this.ctx.beginPath();
		this.ctx.arc(ox,oy,r,0,2*Math.PI,false);
		this.ctx.closePath();
		this.ctx[this.style]();
	},
	brush:function(){
		let that=this;
		that.mask.onmousedown=function(e){
			let ox=e.offsetX,oy=e.offsetY;
			if(that.history.length>0){
				that.ctx.putImageData(that.history[that.history.length-1],0,0);
			}
			that.init();
			that.ctx.beginPath();
			that.ctx.moveTo(ox,oy);
			that.mask.onmousemove=function(e){
				let cx=e.offsetX,cy=e.offsetY;
				that.ctx.lineTo(cx,cy);
				that.ctx.stroke();
			}
			that.mask.onmouseup=function(){
				that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
				that.mask.onmousemove=null;
				that.mask.onmouseup=null;
			}
		}
		that.back();
	},
	rect:function(ox,oy,cx,cy){
		this.ctx.beginPath();
		this.ctx.rect(ox,oy,cx-ox,cy-oy);
		this.ctx[this.style]();
	},
	back:function(){
		let that=this;
		document.onkeydown=function(e){
			if(e.ctrlKey&&e.keyCode==90){
				that.history.pop();
				if(that.history.length==0){
					that.ctx.clearRect(0,0,that.cw,that.ch);
				}else{
					that.ctx.putImageData(that.history[that.history.length-1],0,0)
				}
			}
		}
	},
	wenzi:function(){
		this.init();
		this.mask.onmousedown=function(e){
			let that=this;
			let ox=e.offsetX,oy=e.offsetY;
			let divs=document.createElement('div');
			divs.style.cssText=`
				width:100px;height:20px;border:1px dashed #333;background:#fff;
				position:absolute;left:${ox}px;top:${oy}px;
			`;
			this.mask.appendChild(divs);
			this.mask.onmousedown=null;
			divs.contentEditable=true;
			let lefts,tops;
			divs.onmousedown=function(e){
				let OX=e.offsetX,OY=e.offsetY;
				let leftsw=e.clientX-OX-this.offsetLeft;
				let topsw=e.clientY-OY-this.offsetTop;
				that.mask.onmousemove=function(e){
					let CX=e.clientX,CY=e.clientY;
					lefts=CX-OX-leftsw;
					tops=CY-OY-topsw;
					if(lefts<=0){
						lefts=0;
					}
					if(lefts>=that.cw-100){
						lefts=that.cw-100;
					}
					if(tops<=0){
						tops=0;
					}
					if(tops>=that.ch-20){
						tops=that.ch-20;
					}
					divs.style.left=`${lefts}px`;
					divs.style.top=`${tops}px`;
				}
				divs.onmouseup=function(){
					that.mask.onmousemove=null;
					divs.onmouseup=null;
				}
			}
			divs.onblur=function(){
				let value=this.innerText;
				that.mask.removeChild(divs);
				that.ctx.font='bold 10px sans-serif';
				that.ctx.textAlign='center';
				that.ctx.textBaseline='middle';
				that.ctx.fillText(value,lefts,tops);
				that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
			}
		}.bind(this)
		this.back();
	},
	draw:function(type){
		let that=this;
		that.mask.onmousedown=function(e){
			let ox=e.offsetX,oy=e.offsetY;
			that.mask.onmousemove=function(e){
				let cx=e.offsetX,cy=e.offsetY;
				let r=Math.sqrt(Math.pow(cx-ox,2)+Math.pow(cy-oy,2));
				let ang=360/that.bian/180*Math.PI;
				that.ctx.clearRect(0,0,that.cw,that.ch);
				if(that.history.length>0){
					that.ctx.putImageData(that.history[that.history.length-1],0,0);
				}
				that.init();
				that[type](ox,oy,cx,cy,r,ang);
			}
			that.mask.onmouseup=function(){
				that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
				that.mask.onmousemove=null;
				that.mask.onmouseup=null;
			}
		}	
		that.back();
	},
	eraserone:function(obj,w,h){
		let that=this;
		this.mask.onmousedown=function(e){
			e.preventDefault();
			obj.style.display='block';
			that.mask.onmousemove=function(e){
				let ox=e.offsetX,oy=e.offsetY;
				let lefts=ox-w/2;
				let tops=oy-h/2;
				if(lefts<=0){
					lefts=0;
				}
				if(lefts>=that.cw-w){
					lefts=that.cw-w;
				}
				if(tops<=0){
					tops=0;
				}
				if(tops>=that.ch-h){
					tops=that.ch-h;
				}
				obj.style.left=`${lefts}px`;
				obj.style.top=`${tops}px`;
				that.ctx.clearRect(lefts,tops,w,h);
			}
			that.mask.onmouseup=function(){
				obj.style.display='none';
				that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
				that.mask.onmousemove=null;
				that.mask.onmouseup=null;
			}
		}
	},
	reverse:function(){
		let imgData=this.ctx.getImageData(0,0,this.cw,this.ch);
		let data=imgData.data;
		for(let i=0;i<data.length;i+=4){
			data[i]=255-data[i];
			data[i+1]=255-data[i+1];
			data[i+2]=255-data[i+2];
		}
		this.ctx.putImageData(imgData,0,0);
		this.history.push(this.ctx.getImageData(0,0,this.cw,this.ch));
		this.back();
	}
}
