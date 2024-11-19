import ProductDashboard from "./ProductDashboard/ProductDashboard";
import CustomerDashboard from "./CustomerDashboard/CustomerDashboard";

export default function ContentAdmin({ selectedContent }) {
    const renderContent = () => {
        switch (selectedContent) {
            case 'products':
                return <ProductDashboard/>
                case 'customers':
                    return <CustomerDashboard/>
            case 'orders':
                return <p className="text-base text-muted-foreground">Here are your orders.</p>;

            case 'settings':
                return <p className="text-base text-muted-foreground">Here are your settings.</p>;
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
