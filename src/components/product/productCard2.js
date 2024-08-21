import Image from "next/image";
import Link from "next/link";

export default function ProductCard2({ product }) {

    return (
        <Link href={`/product/${product.id}`}>
                <div className="w-40 h-full shadow flex flex-col items-center justify-center text-center font-bold">
            <h3 className="text-sm">{product.title}</h3>
            {/*Imagen */}
            <div className="flex items-center justify-center bg-slate-200 rounded-md my-2 w-full">
                <Image
                    src={product.img}
                    alt={`${product.title} imagen`}
                    width={100}
                    height={100}
                    className=""
                />
            </div>
            <p className="">$ {product.price}</p>
        </div>
        </Link>
    );
}
