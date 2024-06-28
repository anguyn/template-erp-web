import axiosClient from '../axiosClient';

const purchaseApi = {
    getAllSalesPerson: (props) => {
        const url = `/SalesPersons`;
        // NOTE: query
        let query = '?';
        if (props) {
            const { select, filter, orderby, top, skip } = props;

            if (select) query += '$select=' + select;

            if (filter) {
                if (select) query += '&';
                if (filter.length === 1) {
                    query += '$filter=' + filter[0];
                } else if (filter.length > 1) {
                    query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
                }
            }

            if (orderby) {
                if (filter) query += '&';
                if (orderby.length === 1) {
                    query += '$orderby=' + orderby[0];
                } else if (orderby.length > 1) {
                    query += '$orderby=' + orderby.join(', ');
                }
            }

            if (top) {
                if (orderby) query += '&';
                query += '$top=' + top;
            }

            if (skip) {
                query += '&$skip=' + skip;
            }
        }

        const options = {
            headers: {
                Prefer: 'odata.maxpagesize=0',
            },
        };

        return axiosClient().get(`${url + query}`, options);
    },
    getGoodsReceiptPODocQuantity: () => {
        const url = `/PurchaseDeliveryNotes/$count`
        return axiosClient().get(`${url}`);
    },
    getAllGoodReceiptPODoc: (props) => {
        const url = `/PurchaseDeliveryNotes`;
        // NOTE: query
        let query = '?';
        if (props) {
            const { select, filter, orderby, top, skip } = props;

            if (select) query += '$select=' + select;

            if (filter) {
                if (select) query += '&';
                if (filter.length === 1) {
                    query += '$filter=' + filter[0];
                } else if (filter.length > 1) {
                    query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
                }
            }

            if (orderby) {
                if (filter) query += '&';
                if (orderby.length === 1) {
                    query += '$orderby=' + orderby[0];
                } else if (orderby.length > 1) {
                    query += '$orderby=' + orderby.join(', ');
                }
            }

            if (top) {
                if (orderby) query += '&';
                query += '$top=' + top;
            }

            if (skip) {
                query += '&$skip=' + skip;
            }
        }

        const options = {
            headers: {
                Prefer: 'odata.maxpagesize=0',
            },
        };

        return axiosClient().get(`${url + query}`, options);
    },
    getAdditionalExpenses: (props) => {
        const url = `/AdditionalExpenses`
        const options = {
            headers: {
                Prefer: 'odata.maxpagesize=0',
            },
        };
        return axiosClient().get(`${url}`, options);
    },
    getAllTaxCode: (props) => {
        const url = `/SalesTaxCodes`;
        let query = '?';
        if (props) {
            const { select, filter, orderby, top, skip } = props;

            if (select) query += '$select=' + select;

            if (filter) {
                if (select) query += '&';
                if (filter.length === 1) {
                    query += '$filter=' + filter[0];
                } else if (filter.length > 1) {
                    query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
                }
            }

            if (orderby) {
                if (filter) query += '&';
                if (orderby.length === 1) {
                    query += '$orderby=' + orderby[0];
                } else if (orderby.length > 1) {
                    query += '$orderby=' + orderby.join(', ');
                }
            }

            if (top) {
                if (orderby) query += '&';
                query += '$top=' + top;
            }

            if (skip) {
                query += '&$skip=' + skip;
            }
        }

        const options = {
            headers: {
                Prefer: 'odata.maxpagesize=0',
            },
        };

        return axiosClient().get(`${url + query}`, options);
    },
    getAllPaymentTerm: (props) => {
        const url = `/PaymentTermsTypes`;
        let query = '?';
        if (props) {
            const { select, filter, orderby, top, skip } = props;

            if (select) query += '$select=' + select;

            if (filter) {
                if (select) query += '&';
                if (filter.length === 1) {
                    query += '$filter=' + filter[0];
                } else if (filter.length > 1) {
                    query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
                }
            }

            if (orderby) {
                if (filter) query += '&';
                if (orderby.length === 1) {
                    query += '$orderby=' + orderby[0];
                } else if (orderby.length > 1) {
                    query += '$orderby=' + orderby.join(', ');
                }
            }

            if (top) {
                if (orderby) query += '&';
                query += '$top=' + top;
            }

            if (skip) {
                query += '&$skip=' + skip;
            }
        }

        const options = {
            headers: {
                Prefer: 'odata.maxpagesize=0',
            },
        };

        return axiosClient().get(`${url + query}`, options);
    },
    getAllSerialNumber: (props) => {
        const url = `/view.svc/B1_ItemSerialB1SLQuery`;
        let query = '?';
        if (props) {
            const { select, filter, orderby, top, skip } = props;

            if (select) query += '$select=' + select;

            if (filter) {
                if (select) query += '&';
                if (filter.length === 1) {
                    query += '$filter=' + filter[0];
                } else if (filter.length > 1) {
                    query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
                }
            }

            if (orderby) {
                if (filter) query += '&';
                if (orderby.length === 1) {
                    query += '$orderby=' + orderby[0];
                } else if (orderby.length > 1) {
                    query += '$orderby=' + orderby.join(', ');
                }
            }

            if (top) {
                if (orderby) query += '&';
                query += '$top=' + top;
            }

            if (skip) {
                query += '&$skip=' + skip;
            }
        }

        const options = {
            headers: {
                Prefer: 'odata.maxpagesize=0',
            },
        };

        return axiosClient().get(`${url + query}`, options);
    },
    getAllBatchNumber: (props) => {
        const url = `/view.svc/B1_ItemBatchB1SLQuery`;
        let query = '?';
        if (props) {
            const { select, filter, orderby, top, skip } = props;

            if (select) query += '$select=' + select;

            if (filter) {
                if (select) query += '&';
                if (filter.length === 1) {
                    query += '$filter=' + filter[0];
                } else if (filter.length > 1) {
                    query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
                }
            }

            if (orderby) {
                if (filter) query += '&';
                if (orderby.length === 1) {
                    query += '$orderby=' + orderby[0];
                } else if (orderby.length > 1) {
                    query += '$orderby=' + orderby.join(', ');
                }
            }

            if (top) {
                if (orderby) query += '&';
                query += '$top=' + top;
            }

            if (skip) {
                query += '&$skip=' + skip;
            }
        }

        const options = {
            headers: {
                Prefer: 'odata.maxpagesize=0',
            },
        };

        return axiosClient().get(`${url + query}`, options);
    },
    uploadAttachment: (data) => {
        const url = `/Attachments2`;
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        return axiosClient().post(
            url,
            data,
            config
        );
    },
    deleteAttachment: (data) => {
        const {AbsoluteEntry} = data;
        if (!AbsoluteEntry) throw new Error("AbsoluteEntry is not defined")
        const url = `/Attachments2(${AbsoluteEntry})`;
        return axiosClient().delete(url);
    },
    createGoodsReceiptPO: (data) => {
        const url = `/PurchaseDeliveryNotes`;
        const config = {
            headers: { "Content-Type": "application/json" },
        };
        return axiosClient().post(
            url,
            data,
            config
        );
    },
    getAllPurchaseQuotation: (props) => {
        const url = `/PurchaseQuotations`;
        // NOTE: query
        let query = '?';
        if (props) {
            const { select, filter, orderby, top, skip } = props;

            if (select) query += '$select=' + select;

            if (filter) {
                if (select) query += '&';
                if (filter.length === 1) {
                    query += '$filter=' + filter[0];
                } else if (filter.length > 1) {
                    query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
                }
            }

            if (orderby) {
                if (filter) query += '&';
                if (orderby.length === 1) {
                    query += '$orderby=' + orderby[0];
                } else if (orderby.length > 1) {
                    query += '$orderby=' + orderby.join(', ');
                }
            }

            if (top) {
                if (orderby) query += '&';
                query += '$top=' + top;
            }

            if (skip) {
                query += '&$skip=' + skip;
            }
        }

        const options = {
            headers: {
                Prefer: 'odata.maxpagesize=0',
            },
        };

        return axiosClient().get(`${url + query}`, options);
    },
    getAllPurchaseOrder: (props) => {
        const url = `/PurchaseOrders`;
        // NOTE: query
        let query = '?';
        if (props) {
            const { select, filter, orderby, top, skip } = props;

            if (select) query += '$select=' + select;

            if (filter) {
                if (select) query += '&';
                if (filter.length === 1) {
                    query += '$filter=' + filter[0];
                } else if (filter.length > 1) {
                    query += '$filter=' + filter.map((f) => `(${f})`).join(' and ');
                }
            }

            if (orderby) {
                if (filter) query += '&';
                if (orderby.length === 1) {
                    query += '$orderby=' + orderby[0];
                } else if (orderby.length > 1) {
                    query += '$orderby=' + orderby.join(', ');
                }
            }

            if (top) {
                if (orderby) query += '&';
                query += '$top=' + top;
            }

            if (skip) {
                query += '&$skip=' + skip;
            }
        }

        const options = {
            headers: {
                Prefer: 'odata.maxpagesize=0',
            },
        };

        return axiosClient().get(`${url + query}`, options);
    }
}
export default purchaseApi;
