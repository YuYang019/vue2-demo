export function formatDate(date, fmt){
	//fmt = "yyyy-MM-dd hh:mm" 日期格式,用正则匹配替换成实际日期
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		if(new RegExp(`(${k})`).test(fmt)){
			let str = o[k] + '';
			//如果是fmt里有单个字母，比如yyyy-m-d这样的，说明m,d不用补零
			fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str));
		}
	}
	return fmt;
}

//补零函数，小技巧
function padLeftZero(str) {
	return ('00'+str).substr(str.length);
}