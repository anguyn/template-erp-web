import buildQuery from "@/utils/buildQuery";
import { Agent } from "https";

const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

const purchaseApi = {
    getAllSalesPerson: async (props, cookies) => {
        const url = `${baseURL}/SalesPersons`;
        const query = buildQuery(props);

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
            credentials: 'include' ,
        };

        const response = await fetch(`${url}${query}`, options);
        return response;
    },

    getGoodsReceiptPODocQuantity: async (cookies) => {
        const url = `${baseURL}/PurchaseDeliveryNotes/$count`;

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
            credentials: 'include' ,
        };

        const response = await fetch(url, options);
        return response;
    },

    getAllGoodReceiptPODoc: async (props, cookies) => {
        const url = `${baseURL}/PurchaseDeliveryNotes`;
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
    },

    getGoodReceiptPO: async (id, cookies) => {
        const url = `${baseURL}/PurchaseDeliveryNotes(${id})`;

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

    getPurchaseOrderDocQuantity: async (cookies) => {
        const url = `${baseURL}/PurchaseOrders/$count`;

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
            credentials: 'include' ,
        };

        const response = await fetch(url, options);
        return response;
    },

    getAllPurchaseOrderDoc: async (props, cookies) => {
        const url = `${baseURL}/PurchaseOrders`;
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
    },

    getPurchaseOrder: async (id, cookies) => {
        const url = `${baseURL}/PurchaseOrders(${id})`;

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

    getGoodsReceiptDocQuantity: async (cookies) => {
        const url = `${baseURL}/PurchaseDeliveryNotes/$count`;

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
            credentials: 'include' ,
        };

        const response = await fetch(url, options);
        return response;
    },

    getAdditionalExpenses: async (props, cookies) => {
        const url = `${baseURL}/AdditionalExpenses`;
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
    },

    getAllTaxCode: async (props, cookies) => {
        const url = `${baseURL}/SalesTaxCodes`;
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
    },

    getAllPaymentTerm: async (props, cookies) => {
        const url = `${baseURL}/PaymentTermsTypes`;
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
    },

    getAllSerialNumber: async (props, cookies) => {
        const url = `${baseURL}/view.svc/B1_ItemSerialB1SLQuery`;
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
    },

    getAllBatchNumber: async (props, cookies) => {
        const url = `${baseURL}/view.svc/B1_ItemBatchB1SLQuery`;
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
    },

    uploadAttachment: async (data, cookies) => {
        const url = `${baseURL}/Attachments2`;

        const options = {
            method: 'POST',
            headers: {
                'Cookie': cookies
            },
            credentials: 'include', 
            body: data
        };
        console.log("Body: ", data);

        const response = await fetch(url, options);
        return response;
    },

    deleteAttachment: async (data, cookies) => {
        const { AbsoluteEntry } = data;
        if (!AbsoluteEntry) throw new Error("AbsoluteEntry is not defined");

        const url = `${baseURL}/Attachments2(${AbsoluteEntry})`;

        const options = {
            method: 'DELETE',
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

    createGoodsReceiptPO: async (data, cookies) => {
        const url = `${baseURL}/PurchaseDeliveryNotes`;
        console.log("Ra gì: ", data);

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': cookies
            },
            credentials: 'include', 
            body: data
        };

        const response = await fetch(url, options);

        return response;
    },

    updateGoodsReceiptPO: async (id, data, cookies) => {
        const url = `${baseURL}/PurchaseDeliveryNotes(${id})`;

        const options = {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': cookies
            },
            credentials: 'include', 
            body: data
        };

        const response = await fetch(url, options);

        return response;
    },

    cancelGoodReceiptPO: async (id, cookies) => {
        const url = `${baseURL}/PurchaseDeliveryNotes(${id})/Cancel`;

        const options = {
            method: 'POST',
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

    closeGoodReceiptPO: async (id, cookies) => {
        const url = `${baseURL}/PurchaseDeliveryNotes(${id})/Close`;

        const options = {
            method: 'POST',
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

    reopenGoodReceiptPO: async (id, cookies) => {
        const url = `${baseURL}/PurchaseDeliveryNotes(${id})/Reopen`;

        const options = {
            method: 'POST',
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

    getPurchaseQuotationDocQuantity: async (cookies) => {
        const url = `${baseURL}/PurchaseQuotations/$count`;

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'Cookie': cookies
            },
            credentials: 'include' ,
        };

        const response = await fetch(url, options);
        return response;
    },

    getAllPurchaseQuotation: async (props, cookies) => {
        const url = `${baseURL}/PurchaseQuotations`;
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
    },

    getPurchaseQuotation: async (id, cookies) => {
        const url = `${baseURL}/PurchaseQuotations(${id})`;

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
}

export default purchaseApi;
