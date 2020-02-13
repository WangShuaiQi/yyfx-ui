/**
 * Created by Administrator on 2018/5/11.
 */
import axios from 'axios'

const service=axios.create({
    baseURI:process.env.BASE_URL,
    withCredentials: true,
    timeout:5000
})


service.interceptors.request.use(config=>{
    //设置配置区域
    return config
},error=>{
    Promise.reject(error)
})



service.interceptors.response.use(
    response => response,
    //可以在此过滤公用状态码标识
    error=>{
       console.log('error:',error.message);
        return Promise.reject(error)
    }
)



export default service