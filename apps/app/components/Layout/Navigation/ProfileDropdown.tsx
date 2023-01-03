import { ExitIcon, ChevronDownIcon, MixerHorizontalIcon} from '@radix-ui/react-icons';
import { Menu, MenuButton, HStack, Avatar, Text, forwardRef, MenuList, MenuDivider, MenuItem, Icon } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';

import { reset } from "~/lib/analytics";
import { useRouter } from 'next/router';
import { ShareFeedback } from '~/components/Layout/Navigation/ShareFeedback';
import { useUser } from '~/lib/context/useUser';
import { RouterOutput } from '~/lib/trpc';

const DropdownButton = forwardRef(({ user }: { user: RouterOutput['users']['getUser'] }, ref) => (
  <HStack spacing = {{ base: 1, md: 3 }}  ref = { ref } justifyContent = "space-between">
    <Avatar size = 'sm' name = { user.name || user.email! } />
    <Text display = {{ base: 'none', md: 'flex'}}>{ user.name }</Text>
    <ChevronDownIcon />
  </HStack>
))

export const ProfileDropdown = () => {
  const router = useRouter();
  const { user } = useUser();

  const onSignOut = () => {
    signOut({ callbackUrl: '/login'}).then(() => {
      reset();
    })
  }

  const menuItems = [
    { label: "Settings", icon: MixerHorizontalIcon, onClick: () => router.push('/settings') },
    { label: "Logout", icon: ExitIcon, onClick: onSignOut }
  ];

  return (
    <Menu>
      <MenuButton>
        { user && <DropdownButton user = { user } /> }
      </MenuButton>
      <MenuList>
        <ShareFeedback />
        <MenuDivider />
        { menuItems.map(item => (
          <MenuItem
            key = { item.label }
            icon = { <Icon display = "flex" alignItems = "center" as = { item.icon } width = "12px" height = "12px" /> }
            onClick = { item.onClick }
          >{ item.label }</MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}