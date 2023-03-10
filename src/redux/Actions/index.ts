interface user{
    id:number;
    email:string;
    name:string;
}
interface action{
    type:string;
    payload?:any;
}

export const AddUser = (content:user):action=>{
    return{
        type:"ADD_USER",
        payload:content
    }
}

export const DeleteUser = ():action=>{
    return{
        type:"DELETE_USER",
    }
}