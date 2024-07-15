import pick from "@/utils/pick";
import CGoodsReceiptPOList from "@/components/pages/CGoodsReceiptPOList";

const SELECT = ['DocNum', 'CardCode', 'CardName', 'DocDate', 'DocDueDate', 'DocumentStatus', 'DocTotal', 'DocCurrency', 'DocTotalFc']

const GoodsReceiptPOs = ({ initialData, messages }) => {
    return (
        <CGoodsReceiptPOList initialData={initialData} messages={messages} />
    )
}

GoodsReceiptPOs.messages = ['General', 'GoodsReceiptPOList', 'PageLayout', 'General', 'Languages', 'Navigation', 'Dialog'];

export const getServerSideProps = async (context) => {
    const { locale } = context;

    const cookies = context.req.headers.cookie;

    const payload = {
        top: [100],
        select: SELECT
    }

    // const goodsReceiptPORes = await fetch('http://localhost:3000/api/purchase/get-all-goods-receipt-po', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Cookie': cookies,
    //     },
    //     body: JSON.stringify(payload),
    //     credentials: 'include'
    // });

    const goodsReceiptPOCount = await fetch('http://localhost:3000/api/purchase/get-goods-receipt-po-count', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies,
        },
        credentials: 'include'
    });

    // const data = await goodsReceiptPORes.json();
    const count = await goodsReceiptPOCount.json();
    // console.log("Ga gì: ", data)

    return {
        props: {
            initialData: { count },
            messages: pick(
                (await import(`../../../../messages/${locale}.json`)).default,
                GoodsReceiptPOs.messages
            ),
        },
    };
};

export default GoodsReceiptPOs;
// export default GoodsReceiptPO;
