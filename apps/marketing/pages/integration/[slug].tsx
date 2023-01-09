import { GetStaticPaths, GetStaticPropsContext } from "next";
import { allIntegrations } from 'contentlayer/generated';

const Integration = () => <></>;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: allIntegrations.map(integration => ({
      params: { slug: integration.slug }
    })),
    fallback: false
  }
}

export const getStaticProps = ({ params }: GetStaticPropsContext) => {
  const integration = allIntegrations.find(integration => integration.slug === params?.slug);
  if ( !integration ) {
    return {
      redirect: {
        destination: '/integrations',
        permanent: true
      }
    }
  }

  return {
    redirect: {
      destination: '/integrations/' + integration.slug,
      permanent: true
    }
  }
}

export default Integration