import { useApi } from "../config/axiosConfig";

class UserApi{
    axiosInstance: any = useApi();
    async createUser(  data: { uid: string,
        phoneNo: string |null, 
        name: string | null}){
           
        return await this.axiosInstance.post('/api/auth',data)
    }
}

export default  new UserApi()