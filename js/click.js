window.onload=function(){
	let canvas=document.querySelector('canvas');
	let mask=document.querySelector('.mask');
	let formm=document.querySelector('.formm');
	let make=document.querySelectorAll('.make');
	let yanse=document.querySelectorAll('.yanse');
	let input1=document.querySelectorAll('input');
	let caijian=document.querySelectorAll('.caijian');
	let line1=new Palette(canvas,mask);
	let flag=true;
	make.forEach((ele,index)=>{
		ele.onclick=function(){
			
			for(let i=0;i<make.length;i++){
				make[i].setAttribute('active','false');
			}
			line1.draw(ele.id);
			if(index==3){
				line1.brush();
			}
			ele.setAttribute('active','true');	
		}
	})
	formm.onclick=function(){		
		if(flag){
			flag=false;
			formm.innerText='虚线';
			line1.ctx.setLineDash([10,10]);
		}else{
			flag=true;
			formm.innerText='实线';
			line1.ctx.setLineDash([0,0]);
		}
	}
	yanse.forEach(ele=>{
		ele.onclick=function(){
			for(let i=0;i<yanse.length;i++){
				yanse[i].setAttribute('active','false');
			}
			ele.setAttribute('active','true');	
			line1.style=ele.id;
		}
	})
	input1.forEach((ele,index)=>{
		ele.onchange=function(){
			if(index==0){
				line1.strokeStyle=ele.value;
				alert(ele.value)
			}else{
				line1.fillStyle=ele.value;
			}
		}
	})
	
	caijian.forEach(ele=>{
		ele.onclick=function(){
			for(let i=0;i<caijian.length;i++){
				caijian[i].setAttribute('active','false');
			}
			xiangpica.setAttribute('active','false');
			ele.setAttribute('active','true');	
		}
	})
	let eraser=document.querySelector('.eraser');
	let xiangpica=document.querySelector('.icon-xiangpica');
	xiangpica.ondblclick=function(){
		line1.eraserone(eraser,20,20);
	}
	let wenzi=document.querySelector('.icon-wenzi');
	wenzi.ondblclick=function(){
		line1.wenzi();
	}
	let baocun=document.querySelector('.icon-baocun');
	baocun.onclick=function(){
		baocun.href=canvas.toDataURL('img/png');
		baocun.download='a.png';
	}
	let reverse=document.querySelector('.icon-iconfontxuanzhuan');
	reverse.onclick=function(){
		line1.reverse();
	}
	let cancel=document.querySelector('.icon-chexiao');
	cancel.onclick=function(){
		line1.history.pop();
		if(line1.history.length==0){
			line1.ctx.clearRect(0,0,line1.cw,line1.ch);
		}else{
			line1.ctx.putImageData(line1.history[line1.history.length-1],0,0)
		}
	}
}
