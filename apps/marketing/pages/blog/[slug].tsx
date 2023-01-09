import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import { allBlogPosts } from 'contentlayer/generated';
import { BlogPost } from '~/components/BlogPost';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { Heading, Link, Text, OrderedList, UnorderedList, ListItem } from '@chakra-ui/react';

const SingleIntegration = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <>
      <NextSeo
        title = { post.title }
        description = { post.description }
      />

      <BlogPost post = { post }>
        <MDXContent 
          components = {{
            h1: props => <Heading variant = "h1" { ...props } />,
            h2: props => <Heading mb  = "2" variant = "h2" { ...props } />,
            p: props => <Text { ...props } mb = "6" />,
            a: Link,
            ul: props => <UnorderedList { ...props } mb = "6" />,
            ol: props => <OrderedList { ...props } mb = "6" />,
            li: ListItem
          }}
        />
      </BlogPost>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: allBlogPosts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: false
  }
}

export const getStaticProps = ({ params }: GetStaticPropsContext) => {
  const post = allBlogPosts.find(post => post.slug === params?.slug);
  if ( !post ) {
    return {
      redirect: {
        destination: '/blog',
        permanent: true
      }
    }
  }

  return { props: { post } };
}

export default SingleIntegration;