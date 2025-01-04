export interface IUserRepository{
    createUser(uid:string):Promise<any>;
    search(query:string):Promise<any>
}