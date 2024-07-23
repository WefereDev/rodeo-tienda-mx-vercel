import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {ProductForm} from './products.$handle';
import Countdown from '~/components/Contador';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderArgs) {
  const {storefront} = context;
  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle: 'rodeo-tienda'},
  });

  if (!collection) {
    throw new Response(null, {status: 404});
  }

  return {
    collection,
  };
}

export default function Homepage() {
  const {collection} = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <img
        className="fixed top-0 left-0 w-dvw h-dvh object-cover object-top -z-50 pointer-events-none"
        src={collection.image.url}
      />
      <Countdown />
      <ProductsCollection products={collection.products.nodes} />
    </div>
  );
}

function ProductsCollection({products}) {
  return (
    <div className="products-collection max-w-[980px] mx-auto grid lg:grid-cols-2 gap-6 py-8 px-4">
      {products.map((product) => (
        <div className="flex flex-col items-center justify-center gap-3">
          <h2 className="bg-gradient-to-t border-black  from-[#D6A585] bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xl text-center font-black uppercase border-2 rounded-lg flex items-center justify-center w-fit px-4 min-h-10">
            {product.title}
          </h2>
          <div key={product.id} className="border-2 border-black bg-white">
            <Link key={product.id} to={`/products/${product.handle}`}>
              <Image data={product.featuredImage} />
            </Link>
            <div className="flex flex-col gap-3 p-6">
              <Money data={product.priceRange.minVariantPrice} />
              <ProductForm
                product={product}
                selectedVariant={product?.variants.nodes[0]}
                variants={product?.variants || []}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantIn on ProductVariant {
    availableForSale
    quantityAvailable
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment ProductIn on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    featuredImage {
      url
      altText
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        ...ProductVariantIn
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const COLLECTION_QUERY = `#graphql
  query CollectionIn($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      image {
        url
        id
      }
      products(first: 10) {
        nodes {
          ...ProductIn
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
