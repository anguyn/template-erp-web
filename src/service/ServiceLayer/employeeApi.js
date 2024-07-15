import buildQuery from "@/utils/buildQuery";

const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

const employeeApi = {
    getAllEmployee: async (props, cookies) => {
        const url = `${baseURL}/EmployeesInfo`;
        const query = buildQuery(props);

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
            credentials: 'include',
        };

        const response = await fetch(`${url}${query}`, options);

        return response;

    },
};

export default employeeApi;
