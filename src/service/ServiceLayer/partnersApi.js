import axiosClient from '../axiosClient';

const url = `/BusinessPartners`;

const partnersApi = {
    getAllPartners: (props) => {
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

    getPartnerByCardCode: (code) => {
        return axiosClient().get(`${url}('${code}')`);
    },
};

export default partnersApi;
