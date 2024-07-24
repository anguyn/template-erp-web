import buildQuery from "@/utils/buildQuery";

const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

const globalApi = {
    getAllCurrency: async (props, cookies) => {
        const url = `${baseURL}/Currencies`;
        let query = buildQuery(props);

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
        };

        const response = await fetch(`${url + query}`, options);
        return response;
    },

    getCompanyInfo: async (props, cookies) => {
        const url = `${baseURL}/CompanyService_GetAdminInfo`;
        let query = buildQuery(props);

        console.log("Bị gì nữa?", url)

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
            body: JSON.stringify({})
        };

        const response = await fetch(`${url + query}`, options);
        return response;
    },

    getVatGroups: async (props, cookies) => {
        const url = `${baseURL}/VatGroups`;
        let query = buildQuery(props);

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
        };

        const response = await fetch(`${url + query}`, options);
        return response;
    },

    getDocumentCoA: async (props, cookies) => {
        const url = `${baseURL}/view.svc/B1_GLAccountB1SLQuery`;
        let query = buildQuery(props);

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
        };

        const response = await fetch(`${url + query}`, options);
        return response;
    }
};

export default globalApi;
