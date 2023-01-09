import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next'
import { allBlogPosts } from 'contentlayer/generated';
import { select } from '~/lib/utils';
import { compareDesc } from "date-fns"
import { PostCard } from '~/components/PostCard';
import { useState } from 'react';

const Blog = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [ filter, setFilter ] = useState<'company' | 'howTo' | 'airtable' | 'notion' | 'coda' | 'google' | 'all'>('airtable');
  
  const postFilter = (post: typeof posts[0]) => {
    if ( filter === 'airtable' ) { return post.integration === 'airtable'}
    if ( filter === 'all' ) { return !post.hasGenericPost }
    if ( filter === 'coda' ) { return post.integration === 'coda'}
    if ( filter === 'company' ) { return post.category === 'company'}
    if ( filter === 'google' ) { return post.integration === 'google'}
    if ( filter === 'howTo' ) { return post.category === 'how-to' && !post.hasGenericPost }
    if ( filter === 'notion' ) { return post.integration === 'notion'}
  }

  // TODO: Add way for user to filter

  return (
    <Container maxW = "container.lg">
      <Heading my = "6" variant = "h1">Finta Blog</Heading>

      <SimpleGrid mt = "12" spacing = "6" columns = {{ base: 1, md: 2 }}>
        { posts.filter(postFilter).map((post, index) => <PostCard post = { post } key = { index } /> )}
      </SimpleGrid>
    </Container>
  )
}

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
        'category',
        'integration',
        'hasGenericPost'
      ])
    )
    .sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)))

  return { props: { posts }}
}

export default Blog;