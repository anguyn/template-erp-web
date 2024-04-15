import axiosClient from '../axiosClient';

const url = `/Items`;

const inventoryApi = {
  getAllItems: (props) => {
    // NOTE: query
    let query = '?';
    if (props) {
      const { select, filter, orderby, top, skip } = props;
      if (select) query = query + '$select=' + select;
      if (filter) {
        if (filter.length === 1) query = query + '$filter=' + filter;
        else query = query + '&$filter=' + filter;
      }
      if (orderby) {
        if (filter.length === 1) query = query + '$orderby=' + orderby;
        else query = query + '&$orderby=' + orderby;
      }
      if (top) {
        if (top.length === 1) query = query + '$top=' + top;
        else query = query + '&$top=' + top;
      }
      if (skip) {
        if (skip.length === 1) query = query + '$skip=' + skip;
        else query = query + '&$skip=' + skip;
      }
    }

    const options = {
      headers: {
        Prefer: 'odata.maxpagesize=8',
      },
    };

    return axiosClient().get(`${url}`, options);
  },

  getItemById: (id) => {
    return axiosClient().get(`${url}('${id}')`);
  },
};

export default inventoryApi;
