import ProductDashboardLg from "./ProductDashboardLg";

const ProductDashboard = () => {
  return (
    <>
      {/* Componente para pantallas grandes */}
      <div className="hidden lg:block">
        <ProductDashboardLg />
      </div>
      {/* Componente para móviles */}
    </>
  );
};

export default ProductDashboard;
