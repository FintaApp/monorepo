import { Text, Link, Image, VStack, useColorModeValue as mode, Heading } from "@chakra-ui/react"
import { formatDate } from "~/lib/dates";
import NextLink from 'next/link';

type PostPreview = {
  title: string;
  description: string;
  slug: string;
  image: string;
  category: string;
  publishedAt: string;
  readingTime: string;
}

export const PostCard = ({ post }: { post: PostPreview}) => (
  <VStack spacing = "2">
    <Link as = { NextLink } href = { post.slug }>
      <Image
        src = { post.image }
        alt = { post.title }
        width = "full"
        height = "auto"
        rounded = "sm"
        border = "1px"
        borderColor = { mode('gray.light.9', 'gray.dark.9') }
      />
      <Heading variant = "h2">{ post.title }</Heading>
      <Text>{ post.description }</Text>
      <Text opacity = "0.9">{ formatDate(post.publishedAt) }</Text>
      <Text srOnly>View Post</Text>
    </Link>
  </VStack>
)