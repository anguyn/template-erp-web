import pick from "@/utils/pick";
import CDeliveryList from "@/components/pages/CDeliveryList";

const SELECT = ['DocNum', 'CardCode', 'CardName', 'DocDate', 'DocDueDate', 'DocumentStatus', 'DocTotal', 'DocCurrency', 'DocTotalFc']

const Deliveries = ({ initialData, messages }) => {
    return (
        <CDeliveryList initialData={initialData} messages={messages} />
    )
}

Deliveries.messages = ['General', 'DeliveryList', 'PageLayout', 'General', 'Languages', 'Navigation', 'Dialog', 'Messages'];

export const getServerSideProps = async (context) => {
    const { locale } = context;

    const cookies = context.req.headers.cookie;

    const payload = {
        top: [100],
        select: SELECT
    }

    // const deliveryRes = await fetch('http://localhost:3000/api/purchase/get-all-goods-receipt-po', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Cookie': cookies,
    //     },
    //     body: JSON.stringify(payload),
    //     credentials: 'include'
    // });

    const deliveryCount = await fetch('http://localhost:3000/api/sales/get-delivery-count', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies,
        },
        credentials: 'include'
    });

    // const data = await deliveryRes.json();
    const count = await deliveryCount.json();
    // console.log("Ga gì: ", data)

    return {
        props: {
            initialData: { count },
            messages: pick(
                (await import(`../../../../messages/${locale}.json`)).default,
                Deliveries.messages
            ),
        },
    };
};

export default Deliveries;
// export default Delivery;
