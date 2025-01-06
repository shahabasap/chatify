import { useApi } from "../config/axiosConfig";

class OnetoOneChat{
    axiosInstance: any = useApi();
    async searchUser(name:string){
           
        return await this.axiosInstance.get(`/api/user/search/?query=${name}`)
    }
    async createChat(participants:string[]){
        return await this.axiosInstance.post(`/api/individual-chat/chats`,{participants})
    }
    async getChats(userId:string){
        return await this.axiosInstance.get(`/api/individual-chat/chats/${userId}`)
    }
}

export default  new OnetoOneChat()