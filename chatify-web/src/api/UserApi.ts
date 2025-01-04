import { useApi } from "../config/axiosConfig";

class UserApi{
    axiosInstance: any = useApi();
    async createUser(uid:string){
        return await this.axiosInstance.post('/api/auth',{uid})
    }
}

export default  new UserApi()