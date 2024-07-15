export default function buildQuery(props) {
    let query = '?';
    
    // Hàm helper để thêm các tham số vào query
    const addToQuery = (param) => {
        // Nếu phần tử cuối không phải là '?', thêm '&' trước khi thêm tham số tiếp theo
        if (query.slice(-1) !== '?') {
            query += '&';
        }
        query += param;
    };

    if (props) {
        const { select, filter, orderby, top, skip, inlinecount } = props;

        if (inlinecount) {
            addToQuery('$inlinecount=' + inlinecount);
        }

        if (select) {
            addToQuery('$select=' + select);
        }

        if (filter) {
            if (filter.length === 1) {
                addToQuery('$filter=' + filter[0]);
            } else if (filter.length > 1) {
                addToQuery('$filter=' + filter.map((f) => `(${f})`).join(' and '));
            }
        }

        if (orderby) {
            if (orderby.length === 1) {
                addToQuery('$orderby=' + orderby[0]);
            } else if (orderby.length > 1) {
                addToQuery('$orderby=' + orderby.join(', '));
            }
        }

        if (top) {
            addToQuery('$top=' + top);
        }

        if (skip) {
            addToQuery('$skip=' + skip);
        }
    }
    
    return query;
}
