import axiosClient from "./axiosClient";

interface LogInBody {
    email: string;
    password: string;
}

interface SignUpBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const authApi = {
    logIn: async (body: LogInBody) => {
        const endpoint = 'api/users/signup';
        const response = await axiosClient.post(endpoint, body);
        return response.data;
    },

    signUp: async (body: SignUpBody) => {
        const endpoint = 'api/users/login';
        const response = await axiosClient.post(endpoint, body);
        return response.data;
    }
}