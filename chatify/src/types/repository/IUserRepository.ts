export interface IUserRepository{
    createUser(uid:string,phoneNo:string,name:string):Promise<any>;
    search(query:string):Promise<any>
    updateUserProfile(userId:string,name:string,bio:string):Promise<any>
}