import axiosClient from '../axiosClient';

const url = `/BusinessPartners`;

const partnersApi = {
  getAllPartners: (props) => {
    // NOTE: query
    if (props) {
      const { select, filter, orderby, top, skip } = props;
    }

    return axiosClient().get(`${url}`);
  },

  getPartnerByCardCode: (code) => {
    return axiosClient().get(`${url}('${code}')`);
  },
};

export default partnersApi;
