
import faker from "faker";
import { IUser } from "..";
export const UserList:IUser[]= [
    {
        id: "id1",
        name :"Loc Hoang",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    },
    {
        id: "id2",
        name :"Loc Hoang 2",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    },
    {
        id: "id3",
        name :"Loc Hoang 3",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    },
    {
        id: "id4",
        name :"Loc Hoang 4",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    }
];



const numberUsers = 200;
const createFakeUser = () : IUser=>{
    return {
        id: faker.random.uuid(),
        name :faker.internet.userName(),
        email: faker.internet.email(),
        manageChannels:[],
        roles:[]
    }
}


export const FakeUserList = Array(numberUsers).fill(undefined).map(o=>createFakeUser());

export default faker;