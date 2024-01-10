import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchtoken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token;
}

const fetchUser = async () =>{
    const user:any = await AsyncStorage.getItem('user');
    return JSON.parse(user);
}

export {fetchtoken, fetchUser};