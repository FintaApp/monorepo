import { Box, Container, Divider, Heading, HStack, Image, Link, Text, Tag, useColorModeValue as mode, Button } from "@chakra-ui/react"
import { BlogPost as IBlogPost } from "contentlayer/generated"
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import NextLink from "next/link";
import { formatDate } from "~/lib/dates";
import { categoryMapping } from "~/lib/utils";
import { useRouter } from "next/router";

export const BlogPost = ({ post, children }: { post: IBlogPost, children: any }) => {
  const router = useRouter();
  return (
    <Container maxW = "container.lg">
      <Link mb = "4" display = "flex" alignItems = "center" as = { NextLink } href = "/blog"><ArrowLeftIcon /> View all posts</Link>
      <Heading variant = "h1" textAlign = "center">{ post.title }</Heading>
      <Text mt = "2" textAlign = "center">{ post.description }</Text>
      <Image
        src = { post.image }
        alt = { post.title }
        width = "auto"
        height = "500xp"
        mt = "4"
        rounded = "sm"
      />
      <HStack mt = "4" justifyContent = "space-between">
        <Text variant = "helper">{ formatDate(post.publishedAt) }</Text>
        <Tag>{ categoryMapping[post.category] }</Tag>
      </HStack>

      <Divider my = "6" />

      <article>
        { children }
      </article>

      <Box 
        my = "4" 
        textAlign = "center" 
        bg = { mode('white', 'gray.dark.4') } 
        width = "full"
        border = "1px"
        borderColor = { mode("gray.light.7", "gray.dark.7") }
        p = "4"
        rounded = "sm"
        shadow = { mode('light.sm', 'dark.sm') }
      >
        <Text>{ post.cta }</Text>
        <Button width = {{ base: 'full', sm: 'unset' }} mt = "2" size = "md" variant = "primary" onClick = {() => router.push('https://app.finta.io/signup') }>Get Started with Finta</Button>
      </Box>
    </Container>
  )
}