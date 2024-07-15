import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';

const GRPOHelper = (props) => {
    const { visible, onHide } = props;

    const events = [
        { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
        { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
        { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
        { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
    ];

    const customizedMarker = (item) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" style={{ backgroundColor: item.color }}>
                <i className={item.icon}></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card title={item.status} subTitle={item.date}>
                {item.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${item.image}`} alt={item.name} width={200} className="shadow-1" />}
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                    quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
                <Button label="Read more" className="p-button-text"></Button>
            </Card>
        );
    };

    const renderDFooter = () => {
        return (
            <div>
                <Button label="OK" icon="pi pi-check" onClick={onHide} autoFocus />
            </div>
        )
    };

    return (
        <Dialog
            header="User Helper"
            visible={visible}
            onHide={onHide}
            maximizable
            style={{ width: '80vw', minHeight: '80vh' }}
            contentStyle={{ height: '80vh' }}
            className='!max-h-full'
            baseZIndex={10000}
            breakpoints={{ '960px': '80vw', '641px': '100vw' }}
            footer={renderDFooter}
            blockScroll
        >
            <p>Trong đây sẽ giới thiệu cách nhập liệu, trường nào bắt buộc</p>
            <Timeline value={events} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
        </Dialog>
    )
}

export default GRPOHelper