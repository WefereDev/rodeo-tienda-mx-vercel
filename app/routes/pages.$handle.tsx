import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data.page.title}`}];
};

export async function loader({params, context}: LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  const {storefront} = context;
  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle: 'rodeo-tienda'},
  });

  if (!collection) {
    throw new Response(null, {status: 404});
  }

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return json({page, collection});
}

export default function Page() {
  const {page, collection} = useLoaderData<typeof loader>();

  return (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      {page.title === 'nosotros-rodeo' && (
        <img
          className="fixed top-0 left-0 w-full h-full object-cover object-top -z-50 pointer-events-none"
          src={collection.image.url}
          alt="Background"
        />
      )}
      {page.title === 'preguntas-frecuentes' && (
        <img
          className="fixed top-0 left-0 w-full h-full object-cover object-top -z-50 pointer-events-none"
          src="public/gatos.webp"
          alt="Background"
        />
      )}
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
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
    }
  }
` as const;
