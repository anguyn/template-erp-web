import buildQuery from "@/utils/buildQuery";
const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}/BusinessPartners`;

const partnersApi = {
    getAllPartners: async (props, cookies) => {
        const query = buildQuery(props);  

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
            credentials: 'include' 
        };

        const response = await fetch(`${baseURL}${query}`, options);

        return response;
    },

    getPartnerByCardCode: async (code, cookies) => {
        const url = `${baseURL}('${code}')`;

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': cookies 
            },
            credentials: 'include' 
        };

        const response = await fetch(url, options);

        return response;
    }
};

export default partnersApi;
