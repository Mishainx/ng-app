import { useState } from "react";
import CounterButton from "./CounterButton";
import CtaProduct from "./ctaProduct";

export default function ProductButton() {
    const [showCounter, setShowCounter] = useState(false);

    const handleShowCounter = () => {
        setShowCounter(!showCounter);
    };

    return (
        <div className="">
            {showCounter? <CounterButton onAddClick={handleShowCounter}/>:<CtaProduct onAddClick={handleShowCounter}/>}
        </div>
    );
}
