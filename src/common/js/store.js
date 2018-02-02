export function saveToLocal(id, key, value) {
	// console.log(id,key,value);
	let seller = window.localStorage.__sellers__;
	// 若是第一次保存，原来并没有localStorage.__seller__，那么就初始化seller
	if (!seller) {
		// 所有商家信息
		seller = {};
		// 特定商家信息
		seller[id] = {};
		// seller = JSON.parse(seller);
	} else { //若不是第一次使用，且此次保存的商家信息之前没有保存过，那么向seller中添加相应信息
		//把对象变成JSON型的字符串
		seller = JSON.parse(seller);
		if (!seller[id]) {
			seller[id] = {};
		}
	}
	//若已存在，则直接覆盖
	seller[id][key] = value;
	// 将字符串转化成JSON对象存储到localStorage中
	window.localStorage.__sellers__ = JSON.stringify(seller);
};

export function loadFromLocal(id, key, def) {
	let seller = window.localStorage.__sellers__;
	// 如果之前没有保存过，那么返回默认值
	if(!seller){
		return def;
	}
	// 若保存过，但是没有保存这次想要的商家信息，那么依然返回默认值
	let seller__info=JSON.parse(seller)[id];
	if(!seller__info){
		return def;
	}
	// 若保存过这次想要的商家里特定key值的信息，那么就返回该信息，否则还是返回默认值
	let info__value=seller__info[key];
	return info__value||def;
};