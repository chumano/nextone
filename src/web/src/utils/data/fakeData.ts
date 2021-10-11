
import faker from "faker";
import { IUser } from "..";

const numberUsers = 200;
const createFakeUser = (index?:number) : IUser=>{
    return {
        id: faker.datatype.uuid(),
        name : index+ "---" + faker.internet.userName(),
        email: faker.internet.email(),
        manageChannels:[],
        roles:[],
        isActive: faker.datatype.boolean()
    }
}


export const FakeUserList = Array(numberUsers).fill(undefined).map((o,i)=>createFakeUser(i));

export default faker;