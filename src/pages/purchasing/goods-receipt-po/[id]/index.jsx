import pick from "@/utils/pick";
import CGoodsReceiptPO from "@/components/pages/CGoodsReceiptPO";

const GoodsReceiptPO = ({ initialData, messages }) => {
    return (
        <CGoodsReceiptPO initialData={initialData} messages={messages} />
    )
}

GoodsReceiptPO.messages = ['General', 'CreateGoodsReceiptPO', 'GoodsReceiptPO', 'PageLayout', 'Languages', 'Navigation', 'Dialog'];


export const getServerSideProps = async (context) => {
    const { locale, params } = context;
    const cookies = context.req.headers.cookie;

    // VAT Group
    const vatGroupRes = await fetch('http://localhost:3000/api/purchase/get-input-vat-list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies
        },
        credentials: 'include'
    });

    const vatGroup = await vatGroupRes.json();

    const salesEmployeeRes = await fetch('http://localhost:3000/api/sales/get-sales-employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies
        },
        body: JSON.stringify({
            filter: ["Active eq 'tYES'"]
        }),
        credentials: 'include'
    });

    // console.log("Hmm: ", salesEmployeeRes)
    const salesEmployee = await salesEmployeeRes.json();

    const additionalExpenseRes = await fetch('http://localhost:3000/api/other/get-additional-expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies
        },
        credentials: 'include'
    });

    const additionalExpense = await additionalExpenseRes.json();

    const employeeRes = await fetch('http://localhost:3000/api/employee/get-employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies
        },
        credentials: 'include'
    });

    const employee = await employeeRes.json();


    const data = {
        vatGroup: vatGroup?.value ? vatGroup?.value : [],
        salesEmployee: salesEmployee?.value ? salesEmployee?.value : [],
        additionalExpense: additionalExpense?.value ? additionalExpense?.value : [],
        employee: employee?.value ? employee?.value : []
    }

    return {
        props: {
            initialData: { data },
            messages: pick(
                (await import(`../../../../../messages/${locale}.json`)).default,
                GoodsReceiptPO.messages
            ),
        },
    };
};


export default GoodsReceiptPO