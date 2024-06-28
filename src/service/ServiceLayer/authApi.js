import axiosClient from '../axiosClient';

const usersApi = {
    login: (company, username, password) => {
        const url = `/Login`;
        return axiosClient().post(url, {
            CompanyDB: company,
            UserName: username,
            Password: password,
        });
    },

    logout: () => {
        const url = `/Logout`;
        return axiosClient().post(url);
    },
};

export default usersApi;
