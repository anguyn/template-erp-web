import pick from "@/utils/pick";
import CHome from "@/components/pages/CHome";
const Home = ({ messages }) => {
    return (
        <CHome messages={messages} />
    )
}

Home.messages = ['General', 'Home', 'PageLayout', 'Languages', 'Navigation'];

export async function getStaticProps(context) {
    const { locale } = context;
    return {
        props: {
            // You can get the messages from anywhere you like. The recommended
            // pattern is to put them in JSON files separated by locale and read
            // the desired one based on the `locale` received from Next.js.
            messages: pick(
                (await import(`../../messages/${locale}.json`)).default,
                Home.messages
            )
        }
    };
}

export default Home;
