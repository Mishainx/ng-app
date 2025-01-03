import ProductDashboard from "./ProductDashboard/ProductDashboard";
import CustomerDashboard from "./CustomerDashboard/CustomerDashboard";
import TicketDashboard from "./ticketsDashboard/TicketsDashboard";
import CategoriesDashboard from "./CategoriesDashboard/CategoriesDashboard";

export default function ContentAdmin({ selectedContent,resetView }) {
    const renderContent = () => {
        switch (selectedContent) {
            case 'products':
                return <ProductDashboard resetView={resetView}/>
                case 'customers':
                    return <CustomerDashboard resetView={resetView}/>
            case 'tickets':
                return <TicketDashboard/>;

            case 'categories':
                return <CategoriesDashboard resetView={resetView}/>
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
