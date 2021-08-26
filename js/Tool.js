// 是否Object
export function _isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
//  是否Array
export function _isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
}

// 深度对比
export function _compare(oldData, newData) {
    // 数据相同
    if (oldData === newData) {
        return true;
    } 
    //都是对象且长度相同
    if (_isObject(oldData) && _isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length){ 
        // 遍历所有对象中所有属性,判断元素是否相同
        for (const key in oldData) {
            if (oldData.hasOwnProperty(key)) {
                if (!_compare(oldData[key], newData[key])) { //递归对比
                    // 对象中具有不相同属性 返回false
                    return false
                }
            }
        }
    } else if (_isArray(oldData) && _isArray(oldData) && oldData.length === newData.length) {//都是数组且长度相同
        // 遍历数组中所有元素,判断元素是否相同
        for (let i = 0, length = oldData.length; i < length; i++) {
            if (!_compare(oldData[i], newData[i])) {
                // 如果数组元素中具有不相同元素,返回false
                return false
            }
        }
    } else {
        // 其它均返回false
        return false
    }
    // 走到这里,说明数组或者对象中所有元素都相同,返回true
    return true
}

/**
 * 数组合并
 * @param {boolean} [isRe=false] - 是否保留重复数据
 * */ 
export function _concat(data1, data2, isRe = false) {
    if (isRe) {
      return data1.concat(data2);
    }

    let arr = [];
    for(let item2 of data2) {
       let isSame = false; // 是否相同
       for(let item1 of data1) {
            isSame = _compare(item1, item2);
            if(isSame) break;
       }
       // 不相同
       if (!isSame) {
            arr.push(item2)
       }
    }
    return [...data1, ...arr];
}
/**
 * 将时间处理成想要的格式
 * @description format应该为'yyyy-MM-dd H:mm'之类的格式,可任意组合,autoDate会替换为智能计算出的年月日
 * @param {(string|number|data object)} [date=new Date()] - 时间戳或时间对象
 * @param {String} [format=autoDate H:mm] - 格式,
 **/
export function dateFormat(date = new Date(), format = 'autoDate H:mm') {
    if (!isNaN(date) && (date + '').length == 10) { // 时间戳10位转13位
        date *= 1000;
    }
    date = new Date(date);
    if (!date) return console.error('date有误');

    const dateObj = {
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
    }
    // 设置补全0的值
    for (const key in dateObj) {
        const item = dateObj[key];
        dateObj[key + 's'] = item < 10 ? '0' + item : item;
    }
    dateObj.year = date.getFullYear();
    const { year, month, months, day, days, hour, hours, minute, minutes, second, seconds } = dateObj;
    const obj = {
        'yyyy': year, // 年
        'MM': months, // 月
        'M': month, // 月(不补0)
        'dd': days, // 日
        'd': day, // 日(不补0)
        'HH': hours, // 小时
        'H': hour, // 小时(不补0)
        'mm': minutes, // 分
        'm': minute, // 分(不补0)
        'ss': seconds, // 秒
        's': second // 秒(不补0)
    }

    // 替换智能日期
    if (format.includes('autoDate')) {
        let autoDate = 'yyyy-MM-dd'; 
        const nowDate = new Date();
        // 设置值
        if (year == nowDate.getFullYear()) { // 今年
            const isToDay = month == nowDate.getMonth() + 1 && day == nowDate.getDate(); // 是否为今天
            autoDate = isToDay ? '今天' : 'MM-dd';
        }
        format = format.replace('autoDate', autoDate);
    }
    // 替换为对应值
    for (const key in obj) {
        if (format.includes(key)) {
            format = format.replace(key, obj[key]);
        }
    }
    return format;
  }
