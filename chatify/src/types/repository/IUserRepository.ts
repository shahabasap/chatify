export interface IUserRepository{
    createUser(uid:string,phoneNo:string,name:string):Promise<any>;
    search(query:string,uid:string):Promise<any>
    updateUserProfile(userId:string,name:string,bio:string):Promise<any>
}