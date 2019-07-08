/* eslint-disable */
export function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	console.log(fmt);
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	}

	for (let k in o) {
		// console.log(k);
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = '' + o[k];
			// console.log(str);
			// console.log(RegExp.$1);
			fmt = fmt.replace(RegExp.$1, (RegExp.$1 === 2) ? str : padLeftZero(str));
		}
	}
	return fmt;
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}
