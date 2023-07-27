import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image";
import Head from "next/head";
import { useState } from "react";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);

  async function handleBuyButton() {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (err) {
      setIsCreatingCheckoutSession(false);

      alert('Falha ao redirecionar ao checkout!')
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button disabled={isCreatingCheckoutSession} onClick={handleBuyButton}>
            Comprar agora
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
      paths: [
        { params: { id: 'prod_OKRohDco4apHAI' } },
        { params: { id: 'prod_OKRn94RDIusXF6' } },
        { params: { id: 'prod_OKRF6Irrbv3V1C' } },
        { params: { id: 'prod_OKRDL9r9LeH0Lv' } }
      ],
      fallback: 'blocking',
    }
}

export const getStaticProps:GetStaticProps<any, {id: string}> = async({params})=> {
    //@ts-ignore
    const productId = params.id;

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price'],
    })

    const price = product.default_price as Stripe.Price

    const formattedPrice = Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        // @ts-ignore
      }).format(price.unit_amount / 100)


    return {
        
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                // @ts-ignore
                price: formattedPrice,
                description: product.description,
                defaultPriceId: price.id,
            }
        },
        revalidate: 60 * 60 * 1, //1 hour
    }
}