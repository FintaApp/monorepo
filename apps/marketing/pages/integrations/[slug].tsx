import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import { allIntegrations } from 'contentlayer/generated';
import { Integration } from '~/components/Integration';
import { useMDXComponent } from 'next-contentlayer/hooks';

const SingleIntegration = ({ integration }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const MDXContent = useMDXComponent(integration.body.code);

  return (
    <>
      <NextSeo
        title = { `Sync financial data to ${integration.name}`}
        description = { integration.description }
      />

      <Integration integration = { integration }>
        <MDXContent />
      </Integration>
    </>
  )
}

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

  return { props: { integration } };
}

export default SingleIntegration;