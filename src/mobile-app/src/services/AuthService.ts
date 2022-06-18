import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";
import { UserTokenInfoResponse } from "../types/Auth/Auth.type";

class AuthService{
    constructor(){
        
    }

    async getAccessToken(){
        const userTokenInfoString = await AsyncStorage.getItem('@UserToken');
        if (userTokenInfoString) {
          const userTokenInfoResponse = qs.parse(
            userTokenInfoString,
          ) as unknown as UserTokenInfoResponse;
          const accessToken = userTokenInfoResponse.access_token;
          return accessToken;
        }

        return undefined;
    }
}

const AuthServiceInstance =  new AuthService();

export default AuthServiceInstance;