interface user{
    id:number;
    email:string;
    name:string;
}
const user: user | null = JSON.parse(localStorage.getItem("userDetails")!);

const UserReducer = (state: user | null = user,action:any)=>{
    switch(action.type){
        case "ADD_USER":{
            const newState = {...state, ...action.payload};
            return newState;
        }
        case "DELETE_USER":{
            return null;
        }
        default :{
            return state;
        }
    }
}
export default UserReducer;