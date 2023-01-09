import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next'
import { allBlogPosts } from 'contentlayer/generated';
import { select } from '~/lib/utils';
import { compareDesc } from "date-fns"
import { PostCard } from '~/components/PostCard';

const Blog = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Container maxW = "container.lg">
    <Heading my = "6" variant = "h1">Finta Blog</Heading>

    <SimpleGrid column = {{ base: 1, md: 2, lg: 3 }}>
      { posts.map((post, index) => <PostCard post = { post } key = { index } /> )}
    </SimpleGrid>
  </Container>
)

export function getStaticProps() {
  const posts = allBlogPosts
    .map(post =>
      select(post, [
        'slug',
        'title',
        'description',
        'publishedAt',
        'readingTime',
        'image',
        'category'
      ])
    )
    .sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)))

  return { props: { posts }}
}

export default Blog;