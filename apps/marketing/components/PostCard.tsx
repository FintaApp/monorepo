import { Text, Link, Image, VStack, useColorModeValue as mode, Heading, Card, CardBody, Divider, HStack, Tag, Box, CardFooter } from "@chakra-ui/react"
import { formatDate } from "~/lib/dates";
import NextLink from 'next/link';
import { categoryMapping } from "~/lib/utils";

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
  <Link variant = "unstyled" as = { NextLink } href = { '/blog/' + post.slug }>
    <Card
      border = "1px" 
      borderColor = { mode('gray.light.2', 'gray.dark.2') } 
      _hover = {{ borderColor: mode('gray.light.6', 'gray.dark.6') }}
    >
      <CardBody 
        minH = "300px" 
        maxH = "300px" 
        rounded = "sm" 
        py = "0" 
        px = "0" 
      >
        <VStack spacing = "2">
            <Box height = "150px" overflow = "hidden">
              <Image
                src = { post.image }
                alt = { post.title }
                width = "full"
                height = "auto"
                rounded = "sm"
                mx = "auto"
              />
            </Box>
            <Box 
              px = "4" py = "4"
              bg = { mode('white', 'gray.dark.4') }
            >
              <Heading variant = "h3" fontWeight = "medium">{ post.title }</Heading>
              <Text mt = "1">{ post.description }</Text>
              <Text srOnly>View Post</Text>
            </Box>
        </VStack>
      </CardBody>

      <CardFooter borderTop = "1px" borderTopColor = { mode('gray.light.7', 'gray.dark.7') }>
        <HStack justifyContent = "space-between" width = "full">
          <Text variant = "helper">{ formatDate(post.publishedAt) }</Text>
          <Tag>{ categoryMapping[post.category] }</Tag>
        </HStack>
      </CardFooter>
    </Card>
  </Link>
)