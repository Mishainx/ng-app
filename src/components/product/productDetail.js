import Image from "next/image";
import ProductButton from "./productButton";

export default function ProductDetail({ product, onClose }) {
    return (
        <div className="w-full p-5 fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75 z-50">
            <div className=" rounded-lg shadow-lg w-full max-w-lg relative text-white bg-slate-100 text-center text-sm bg-gradient-to-r from-slate-600 to-slate-900">
                <button
                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-600"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div>
                    
                </div>
                <div className="w-full h-32 flex justify-center items-center">
                    <Image
                        src={product.img}
                        alt={`${product.title} imagen`}
                        width={250}
                        height={250}
                        className=" h-auto rounded relative  bottom-10"
                    />
                </div>
                <div>
                    <p className="">{product.category}</p>
                    <h2 className="text-xl font-bold text-white ">{product.title}</h2>
                    <p className="">{product.description}</p>
                    <p className="text-xs">
                        {`Presentación: ${product.shortDescription.charAt(0).toUpperCase()}${product.shortDescription.slice(1)}`}
                    </p>
                    <p className=" mb-4">{`$${product.price}`}</p>
                </div>
                
                <ProductButton/>
            </div>
        </div>
    );
}
