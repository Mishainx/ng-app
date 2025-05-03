import ProductDashboard from "./ProductDashboard/ProductDashboard";
import CustomerDashboard from "./CustomerDashboard/CustomerDashboard";
import TicketDashboard from "./ticketsDashboard/TicketsDashboard";
import CategoriesDashboard from "./CategoriesDashboard/CategoriesDashboard";
import CarrouselDashbaord from "./CarrouselDashboard/CarrouselDashboard";
import CardsDashboard from "./CardsDashboard/CardsDashboard";
import QrDashboard from "./QrDashboard/QrDashboard";
import QrDashboardDashboard from "./QrDashboard/QrDashboard";

export default function ContentAdmin({ selectedContent,resetView }) {
    console.log(selectedContent)
    
    const renderContent = () => {
        switch (selectedContent) {
            case 'products':
                return <ProductDashboard resetView={resetView}/>
                case 'customers':
                    return <CustomerDashboard resetView={resetView}/>
            case 'tickets':
                return <TicketDashboard/>;

            case 'categories':
                return <CategoriesDashboard resetView={resetView}/>;
            case 'carrousel':
                return <CarrouselDashbaord resetView={resetView}/>
            
                case 'cards':
                    return <CardsDashboard resetView={resetView}/>
                    case 'qr':
                        return <QrDashboardDashboard resetView={resetView}/>     
                default:
                return <p className="text-base text-muted-foreground">Welcome to the dashboard.</p>;
        }
    };

    return (
        <main className="flex-1   bg-background ml-14 lg:ml-60 flex flex-col h-screen">
            <section className="flex-1">
                {renderContent()}
            </section>
        </main>
    );
}
