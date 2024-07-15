import buildQuery from "@/utils/buildQuery";

const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

const inventoryApi = {
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

    getItemById: async (id, cookies) => {
        const url = `${baseURL}/Items/('${id}')`;

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

    getAllGoodsReceipt: async (cookies) => {
        const url = `${baseURL}/$crossjoin(InventoryGenEntries,InventoryGenEntries/DocumentLines)?$expand=InventoryGenEntries($select=DocEntry,DocNum),InventoryGenEntries/DocumentLines($select=BaseType)&$filter=InventoryGenEntries/DocumentLines/BaseType eq -1&$inlinecount=allpages`
        // const query = buildQuery(props);

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
        const response = await fetch(`${url}`, options);

        return response;
    },

    getAllGoodsIssue: async (cookies) => {
        const url = `${baseURL}/$crossjoin(InventoryGenEntries,InventoryGenEntries/DocumentLines)?$expand=InventoryGenEntries($select=DocEntry,DocNum),InventoryGenEntries/DocumentLines($select=BaseType)&$filter=InventoryGenEntries/DocumentLines/BaseType eq 60&$inlinecount=allpages`
        // const query = buildQuery(props);

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
        const response = await fetch(`${url}`, options);

        return response;
    },

    getAllReceiptFromProduction: async (props, cookies) => {
        const url = `${baseURL}/$crossjoin(InventoryGenEntries,InventoryGenEntries/DocumentLines)?$expand=InventoryGenEntries($select=DocEntry,DocNum),InventoryGenEntries/DocumentLines($select=BaseType)&$filter=InventoryGenEntries/DocumentLines/BaseType eq 202&$inlinecount=allpages`
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
        const response = await fetch(`${url}${query}`, options);

        return response;
    }
};

export default inventoryApi;
