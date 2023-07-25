import { ImageContainer, ProductContainer, ProductDetails } from "@/src/styles/pages/product"
import { useRouter } from "next/router"

export default function Product() {
    const { query } = useRouter()

    return (
        <ProductContainer>
            <ImageContainer>
                
            </ImageContainer>
            <ProductDetails>
                <h1>Camiseta X</h1>
                <span>R$ 79,90</span>

                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum eveniet omnis consectetur, fugit id eligendi maiores. Quas, sit libero labore dolores illum est voluptatem expedita exercitationem ipsum eveniet officiis rerum?</p>

                <button>
                    Comprar agora
                </button>
            </ProductDetails>
        </ProductContainer>
    )
}