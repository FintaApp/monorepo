import { useSignOut } from '@nhost/nextjs';
import { ExitIcon, ChevronDownIcon, MixerHorizontalIcon} from '@radix-ui/react-icons';
import { Menu, MenuButton, HStack, Avatar, Text, forwardRef, MenuList, MenuDivider, MenuItem, Icon } from '@chakra-ui/react';

import { reset } from "~/utils/frontend/analytics";
import { useRouter} from 'next/router';
import { useAuth } from '~/utils/frontend/useAuth';
import { FrontendUserModel } from '~/types/frontend';
import { ShareFeedback } from '~/components/ShareFeedback';

const DropdownButton = forwardRef(({ user }: { user: FrontendUserModel }, ref) => (
  <HStack spacing = {{ base: 1, md: 3 }}  ref = { ref } justifyContent = "space-between">
    <Avatar size = 'sm' name = { user.displayName } />
    <Text display = {{ base: 'none', md: 'flex'}}>{ user.displayName }</Text>
    <ChevronDownIcon />
  </HStack>
))

export const ProfileDropdown = () => {
  const router = useRouter();
  const { signOut } = useSignOut();
  const { user } = useAuth();

  const onSignOut = () => {
    signOut().then(() => {
      reset();
      router.push('/login');
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