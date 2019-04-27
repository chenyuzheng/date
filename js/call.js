window.onload=function(){
	let add=document.querySelector('.add');
	let contact=[
		{'name':'齐传烽','phone':'17835424911','pinyin':'qichuanfeng'},
		{'name':'陈玉珍','phone':'15635450023','pinyin':'chenyuzhen'},
		{'name':'程鹏飞','phone':'17835425035','pinyin':'chengpengfei'},
		{'name':'孔宇宇','phone':'17835424278','pinyin':'kongyuyu'},
		{'name':'王一平','phone':'18306890415','pinyin':'wangyiping'},
		{'name':'甄思琪','phone':'15582408245','pinyin':'zhensiqi'},
		{'name':'李晓兰','phone':'15935696450','pinyin':'lixiaolan'},
		{'name':'尹文敏','phone':'15582408576','pinyin':'yinwenmin'},
		{'name':'裴瑞琪','phone':'17835422297','pinyin':'peiruiqi'},
		{'name':'张聪聪','phone':'18335480474','pinyin':'zhangcong'},
		{'name':'李宁','phone':'13333541440','pinyin':'lining'}
	];
	//获取数据   有的话直接用  没有需要初始化
	let data=getData();
	console.log(data)
	function getData(){
		let data=localStorage.getItem('contact')?JSON.parse(localStorage.contact):false;
		if(!data){
			localStorage.setItem('contact',JSON.stringify(contact));
			data=JSON.parse(localStorage.contact);
		}
		return data;
	}
	//分类  排序
	let dl=document.querySelector('dl');
	let tips=document.querySelector('.tip');
	let header=document.querySelector('header');
	let height=tips.offsetHeight+header.offsetHeight;
	
	let input=document.querySelector('input');
	let aside=document.querySelector('.aside');
	fn(data);
	
	function fn(data){
		let collection={};
		for(let i=0;i<data.length;i++){
			let code=data[i].pinyin.charAt(0).toUpperCase();
				if(!(collection[code])){
					collection[code]=[];
				}
				collection[code].push(data[i]);
		}
		let keys=Object.keys(collection).sort();
		dl.innerHTML='';
		aside.innerHTML='';
		keys.forEach(ele=>{
			dl.innerHTML+=`
				<dt>${ele}</dt>
			`;
			aside.innerHTML+=`
				<li>${ele}</li>
			`;
			collection[ele].forEach(value=>{
				dl.innerHTML+=`
					<dd><a href='tel:${value.phone}'>${value.name}</dd>
				`;
			})
		})
		tips.innerHTML=keys[0];
		
		window.onscroll=function(){
			let dts=document.querySelectorAll('dt');
			let arr=[];
			dts.forEach(ele=>arr.push(ele.offsetTop));
			let scrool=document.body.scrollTop;
			arr.forEach((ele,index)=>{
				if(ele<height+scrool){
					tips.innerText=keys[index];
				}
			})
		}
	}
	input.onkeyup=function(){
		let content=this.value.trim();
		let filter=data.filter(ele=>ele.name.includes(content)||ele.phone.includes(content)||ele.pinyin.includes(content));
		fn(filter);
	}
	add.ontouch=function(){
		
	}
}
