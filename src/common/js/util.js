/*
 * 解析url参数
 * @example ?id=123&name=jack
 * @return Object {id:12345,name:jack}
 */
export function urlParse() {
	let url = window.location.search;
	let obj = {};
	let reg = /[?&][^?&]+=[^?&]+/g;
	         //  ?或&  id,name等   =  123,jack等非?或&
	let arr = url.match(reg);
	// ['?id=123',&name=jack]
	if (arr) {//如果匹配了
		arr.forEach((item) => {
			let tempArr = item.substring(1).split('=');//[id,123,name,jack]
			let key = decodeURIComponent(tempArr[0]);
			let val = decodeURIComponent(tempArr[1]);
			obj[key] = val;
		});
	}
	return obj;  //{id:123,name:jack}
};
