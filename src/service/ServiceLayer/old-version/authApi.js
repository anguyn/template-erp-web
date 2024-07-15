// import axiosClient from '../axiosClient';

// const usersApi = {
//     login: (company, username, password) => {
//         const url = `/Login`;
//         return axiosClient().post(url, {
//             CompanyDB: company,
//             UserName: username,
//             Password: password,
//         });
//     },

//     logout: () => {
//         const url = `/Logout`;
//         return axiosClient().post(url);
//     },
// };

// export default usersApi;

// /service/ServiceLayer/authApi.js

const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

const usersApi = {
    login: async (company, username, password) => {
        const url = `${baseURL}/Login`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CompanyDB: company,
                    UserName: username,
                    Password: password,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // const data = await response.json();
            // return { status: response.status, data };
            return response

        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },

    logout: async () => {
        const url = `${baseURL}/Logout`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { status: response.status, data };

        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    },
};

export default usersApi;
