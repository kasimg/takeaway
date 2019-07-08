/* eslint-disable */
/*
 *解析URL参数
 *@example ?id=12345&a=b
 *@return Object {id:12345,a:b}
 */
export function urlParse() {
	let url = window.location.search;
	let obj = {};
	let reg = /[?&][^?&]+=[^?&]+/g;
	let arr = url.match(reg);
	//['?id=1234','&a=b']
	if (arr) {
		arr.forEach((item) => {
			//忽略第一个字符（？或&）从第二个字符开始截取，并用=分隔
			let tempArr = item.substring(1).split('=');
			// let key=decodeURIComponent(tempArr[0]);
			let key = tempArr[0];
			// let val=decodeURIComponent(tempArr[1]);
			let val = tempArr[1];
			obj[key] = val;
		});
	}
	return obj;
};