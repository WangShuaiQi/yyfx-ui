export default function objDiff(obj1, obj2){
    var type = Object.prototype.toString;
    var diff = [];
    if(type.call(obj1) == "[object Object]" && type.call(obj2) == "[object Object]"){
        for (var key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                if(obj2[key] && obj1[key] != obj2[key]){
                    diff.push(`修改字段：${key}，修改前的值：${obj1[key]}，修改后的值：${obj2[key]}`)
                }
            }
        }
        return diff;
    }
}