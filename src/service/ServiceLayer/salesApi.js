// import axiosClient from '../axiosClient';
// import buildQuery from '@/utils/buildQuery';

// const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

// const salesApi = {
    // getAllSalesPerson: async (props, cookies) => {
    //     const url = "SalesPersons";
    //     const query = buildQuery(props); 
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Prefer': 'odata.maxpagesize=0',
    //             'Cookie': cookies 
    //         },
    //         credentials: 'include' 
    //     };

    //     const response = await fetch(`${baseURL}/${url}${query}`, options);

    //     return response;
    // },
//     getDeliveryDocQuantity: () => {
//         const url = `/DeliveryNotes/$count`
//         return axiosClient().get(`${url}`);
//     },
//     getAllDeliveryDoc: (props) => {
//         const url = `/DeliveryNotes`;
//         // NOTE: query
//         let query = '?';
//         if (props) {
//             const { select, filter, orderby, top, skip } = props;

//             if (select) query += '$select=' + select;

//             if (filter) {
//                 if (select) query += '&';
//                 if (filter.length === 1) {
//                     query += '$filter=' + filter[0];
//                 } else if (filter.length > 1) {
//                     query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
//                 }
//             }

//             if (orderby) {
//                 if (filter) query += '&';
//                 if (orderby.length === 1) {
//                     query += '$orderby=' + orderby[0];
//                 } else if (orderby.length > 1) {
//                     query += '$orderby=' + orderby.join(', ');
//                 }
//             }

//             if (top) {
//                 if (orderby) query += '&';
//                 query += '$top=' + top;
//             }

//             if (skip) {
//                 query += '&$skip=' + skip;
//             }
//         }

//         const options = {
//             headers: {
//                 Prefer: 'odata.maxpagesize=0',
//             },
//         };

//         return axiosClient().get(`${url + query}`, options);
//     },
//     getAdditionalExpenses: async (props, cookies) => {
//         const url = `${baseURL}/AdditionalExpenses`;

//         const options = {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Prefer': 'odata.maxpagesize=0',
//                 'Cookie': cookies
//             },
//             credentials: 'include' 
//         };

//         const response = await fetch(url, options);
//         return response;
//     },
//     getAllTaxCode: (props) => {
//         const url = `/SalesTaxCodes`;
//         let query = '?';
//         if (props) {
//             const { select, filter, orderby, top, skip } = props;

//             if (select) query += '$select=' + select;

//             if (filter) {
//                 if (select) query += '&';
//                 if (filter.length === 1) {
//                     query += '$filter=' + filter[0];
//                 } else if (filter.length > 1) {
//                     query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
//                 }
//             }

//             if (orderby) {
//                 if (filter) query += '&';
//                 if (orderby.length === 1) {
//                     query += '$orderby=' + orderby[0];
//                 } else if (orderby.length > 1) {
//                     query += '$orderby=' + orderby.join(', ');
//                 }
//             }

//             if (top) {
//                 if (orderby) query += '&';
//                 query += '$top=' + top;
//             }

//             if (skip) {
//                 query += '&$skip=' + skip;
//             }
//         }

//         const options = {
//             headers: {
//                 Prefer: 'odata.maxpagesize=0',
//             },
//         };

//         return axiosClient().get(`${url + query}`, options);
//     },
//     getPaymentTerm: async (props, cookies) => {
//         const url = "PaymentTermsTypes";
//         const query = buildQuery(props); 
//         const options = {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Prefer': 'odata.maxpagesize=0',
//                 'Cookie': cookies 
//             },
//             credentials: 'include' 
//         };

//         const response = await fetch(`${baseURL}/${url}${query}`, options);
        
//         return response;
//     },
//     getAllSerialNumber: (props) => {
//         const url = `/view.svc/B1_ItemSerialB1SLQuery`;
//         let query = '?';
//         if (props) {
//             const { select, filter, orderby, top, skip } = props;

//             if (select) query += '$select=' + select;

//             if (filter) {
//                 if (select) query += '&';
//                 if (filter.length === 1) {
//                     query += '$filter=' + filter[0];
//                 } else if (filter.length > 1) {
//                     query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
//                 }
//             }

//             if (orderby) {
//                 if (filter) query += '&';
//                 if (orderby.length === 1) {
//                     query += '$orderby=' + orderby[0];
//                 } else if (orderby.length > 1) {
//                     query += '$orderby=' + orderby.join(', ');
//                 }
//             }

//             if (top) {
//                 if (orderby) query += '&';
//                 query += '$top=' + top;
//             }

//             if (skip) {
//                 query += '&$skip=' + skip;
//             }
//         }

//         const options = {
//             headers: {
//                 Prefer: 'odata.maxpagesize=0',
//             },
//         };

//         return axiosClient().get(`${url + query}`, options);
//     },
//     getAllBatchNumber: (props) => {
//         const url = `/view.svc/B1_ItemBatchB1SLQuery`;
//         let query = '?';
//         if (props) {
//             const { select, filter, orderby, top, skip } = props;

//             if (select) query += '$select=' + select;

//             if (filter) {
//                 if (select) query += '&';
//                 if (filter.length === 1) {
//                     query += '$filter=' + filter[0];
//                 } else if (filter.length > 1) {
//                     query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
//                 }
//             }

//             if (orderby) {
//                 if (filter) query += '&';
//                 if (orderby.length === 1) {
//                     query += '$orderby=' + orderby[0];
//                 } else if (orderby.length > 1) {
//                     query += '$orderby=' + orderby.join(', ');
//                 }
//             }

//             if (top) {
//                 if (orderby) query += '&';
//                 query += '$top=' + top;
//             }

//             if (skip) {
//                 query += '&$skip=' + skip;
//             }
//         }

//         const options = {
//             headers: {
//                 Prefer: 'odata.maxpagesize=0',
//             },
//         };

//         return axiosClient().get(`${url + query}`, options);
//     },
//     uploadAttachment: (data) => {
//         const url = `/Attachments2`;
//         const config = {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         };

//         return axiosClient().post(
//             url,
//             data,
//             config
//         );
//     },
//     deleteAttachment: (data) => {
//         const {AbsoluteEntry} = data;
//         if (!AbsoluteEntry) throw new Error("AbsoluteEntry is not defined")
//         const url = `/Attachments2(${AbsoluteEntry})`;
//         return axiosClient().delete(url);
//     },
//     createDelivery: (data) => {
//         const url = `/DeliveryNotes`;
//         const config = {
//             headers: { "Content-Type": "application/json" },
//         };
//         return axiosClient().post(
//             url,
//             data,
//             config
//         );
//     },
//     getAllSalesOrder: (props) => {
//         const url = `/Orders`;
//         // NOTE: query
//         let query = '?';
//         if (props) {
//             const { select, filter, orderby, top, skip } = props;

//             if (select) query += '$select=' + select;

//             if (filter) {
//                 if (select) query += '&';
//                 if (filter.length === 1) {
//                     query += '$filter=' + filter[0];
//                 } else if (filter.length > 1) {
//                     query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
//                 }
//             }

//             if (orderby) {
//                 if (filter) query += '&';
//                 if (orderby.length === 1) {
//                     query += '$orderby=' + orderby[0];
//                 } else if (orderby.length > 1) {
//                     query += '$orderby=' + orderby.join(', ');
//                 }
//             }

//             if (top) {
//                 if (orderby) query += '&';
//                 query += '$top=' + top;
//             }

//             if (skip) {
//                 query += '&$skip=' + skip;
//             }
//         }

//         const options = {
//             headers: {
//                 Prefer: 'odata.maxpagesize=0',
//             },
//         };

//         return axiosClient().get(`${url + query}`, options);
//     },
//     getAllSalesQuotation: (props) => {
//         const url = `/Quotations`;
//         // NOTE: query
//         let query = '?';
//         if (props) {
//             const { select, filter, orderby, top, skip } = props;

//             if (select) query += '$select=' + select;

//             if (filter) {
//                 if (select) query += '&';
//                 if (filter.length === 1) {
//                     query += '$filter=' + filter[0];
//                 } else if (filter.length > 1) {
//                     query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
//                 }
//             }

//             if (orderby) {
//                 if (filter) query += '&';
//                 if (orderby.length === 1) {
//                     query += '$orderby=' + orderby[0];
//                 } else if (orderby.length > 1) {
//                     query += '$orderby=' + orderby.join(', ');
//                 }
//             }

//             if (top) {
//                 if (orderby) query += '&';
//                 query += '$top=' + top;
//             }

//             if (skip) {
//                 query += '&$skip=' + skip;
//             }
//         }

//         const options = {
//             headers: {
//                 Prefer: 'odata.maxpagesize=0',
//             },
//         };

//         return axiosClient().get(`${url + query}`, options);
//     },
// }
// export default salesApi;

import buildQuery from "@/utils/buildQuery";

const baseURL = `${process.env.NEXT_PUBLIC_SERVICE_LAYER_URL}/${process.env.NEXT_PUBLIC_ODATA_VERSION}`;

const salesApi = {
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
            credentials: 'include' 
        };

        const fullUrl = `${url}${query}`;
        const response = await fetch(fullUrl, options);

        console.log("Là dô đây chưa?: ", response)
        
        return response;
    },

    getDeliveryDocQuantity: async (cookies) => {
        const url = `${baseURL}/DeliveryNotes/$count`;
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

    getAllDeliveryDoc: async (props, cookies) => {
        const url = `${baseURL}/DeliveryNotes`;
        let query = buildQuery(props);

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

        const fullUrl = `${url}${query}`;
        const response = await fetch(fullUrl, options);
        return response;
    },

    getSalesQuotationDocQuantity: async (cookies) => {
        const url = `${baseURL}/Quotations/$count`;
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

    getSalesOrderDocQuantity: async (cookies) => {
        const url = `${baseURL}/Orders/$count`;
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

    getAllTaxCode: async (props, cookies) => {
        const url = `${baseURL}/SalesTaxCodes`;
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

        const fullUrl = `${url}${query}`;
        const response = await fetch(fullUrl, options);
        return response;
    },

    getPaymentTerm: async (props, cookies) => {
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

        const fullUrl = `${url}${query}`;
        const response = await fetch(fullUrl, options);
        
        return response;
    },

    getAllSerialNumber: async (props, cookies) => {
        const url = `${baseURL}/view.svc/B1_ItemSerialB1SLQuery`;
        let query = buildQuery(props);

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
            },
        };

        const fullUrl = `${url}${query}`;
        const response = await fetch(fullUrl, options);
        return response;
    },

    getAllBatchNumber: async (props, cookies) => {
        const url = `${baseURL}/view.svc/B1_ItemBatchB1SLQuery`;
        let query = buildQuery(props);

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
            },
        };

        const fullUrl = `${url}${query}`;
        const response = await fetch(fullUrl, options);
        return response;
    },

    uploadAttachment: async (data) => {
        const url = `${baseURL}/Attachments2`;
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const options = {
            method: 'POST',
            body: formData,
        };

        const response = await fetch(url, options);
        return response;
    },

    deleteAttachment: async (data) => {
        const { AbsoluteEntry } = data;
        if (!AbsoluteEntry) throw new Error("AbsoluteEntry is not defined");
        const url = `${baseURL}/Attachments2(${AbsoluteEntry})`;
        const options = {
            method: 'DELETE',
        };

        const response = await fetch(url, options);
        return response;
    },

    createDelivery: async (data) => {
        const url = `${baseURL}/DeliveryNotes`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const response = await fetch(url, options);
        return response;
    },

    getAllSalesOrder: async (props) => {
        const url = `${baseURL}/Orders`;
        let query = buildQuery(props);

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
            },
        };

        const fullUrl = `${url}${query}`;
        const response = await fetch(fullUrl, options);
        return response;
    },

    getAllSalesQuotation: async (props) => {
        const url = `${baseURL}/Quotations`;
        let query = buildQuery(props);

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
            },
        };

        const fullUrl = `${url}${query}`;
        const response = await fetch(fullUrl, options);
        return response;
    },
};

export default salesApi;
