import type { ProductWithImages } from "@/interfaces";
import { useState } from "react";


interface Props {
    product: ProductWithImages
}

export const ProductCard = ({ product }: Props) => {

    const images = product.images.split(",").map(img => {
        // Check if the image URL starts with "http" to determine if it's an external link
        return img.startsWith("http") ? img : `${import.meta.env.PUBLIC_URL}/images/products/${img}`;
    });

    const [currentImage, setCurrentImage] = useState(images[0]);

    return (
        <a href={`/products/${product.slug}`}>
            <img
                src={currentImage}
                alt={product.title}
                className="h-[350px] object-contain"
                onMouseEnter={() => setCurrentImage(images[1] || currentImage)} // Show second image on hover
                onMouseLeave={() => setCurrentImage(images[0])} // Revert to first image when not hovering
            />
            <h4>{product.title}</h4>
            <p>${product.price}</p>

        </a>
    );
}