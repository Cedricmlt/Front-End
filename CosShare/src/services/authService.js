import API_URL from "./connexionAPI";

const LoginUser = async (userData) => {
    const response = await API_URL.post('http://localhost:3000/api/users/login',
        userData
    );
    return response.data;
};

const RegisterUser = async (userData) => {
    const response = await API_URL.post('http://localhost:3000/api/users/register',
        userData
    );
    return response.data;
};

const LogoutUser = () => {
    localStorage.removeItem("token");
};

export default {
    LoginUser,
    RegisterUser,
    LogoutUser
}
