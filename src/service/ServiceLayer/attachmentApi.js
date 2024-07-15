import buildQuery from "@/utils/buildQuery";

const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

const attachmentApi = {
    getAllItem: async (props, cookies) => {
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

        const response = await fetch(`${baseURL}/Items${query}`, options);
        console.log(response);
        return response;
    },

    getItemQuantity: async (cookies) => {
        const url = `${baseURL}/Items/$count`;

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

        const response = await fetch(url, options);
        return response;
    },

    getAllWarehouse: async (props, cookies) => {
        const warehouseURL = `${baseURL}/Warehouses`;
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

        const response = await fetch(`${warehouseURL}${query}`, options);

        return response;
    },

    getAttachmentById: async (id, cookies) => {
        const url = `${baseURL}/Attachments2(${id})`;

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
    },

    getAttachmentFile: async (body, cookies) => {
        const { attachmentEntry, fileName, fileExtension } = body
        const url = `${baseURL}/Attachments2(${attachmentEntry})/$value?filename='${fileName}.${fileExtension}'`;

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
    },
};

export default attachmentApi;
