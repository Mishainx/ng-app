import RepetanceForm from "@/components/Arrepentimiento/RepetanceForm";


export const metadata = {
    title: "Nippon Game - Arrepentimiento",
    description: "Página para devoluciones de pedidos",
  };

const Arrepentimiento = () => {


  return (
    <main className="h-full py-8">
        <RepetanceForm/>
    </main>
  );
};

export default Arrepentimiento;
