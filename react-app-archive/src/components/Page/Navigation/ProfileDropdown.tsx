import {
  Avatar,
  HStack,
  Icon,
  forwardRef,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text
} from "@chakra-ui/react";
import { MixerHorizontalIcon, ExitIcon, RowsIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useNavigate } from "react-router-dom";

import { UserModel } from "src/types";
import { ShareFeedback } from "src/components/ShareFeedback";
import { useAuth } from "src/lib/useAuth";

const DropdownButton = forwardRef(({ user }: { user: UserModel}, ref) => (
  <HStack spacing = {{ base: 1, md: 3 }}  ref = { ref } justifyContent = "space-between">
    <Avatar size = 'sm' name = { user.display_name } />
    <Text display = {{ base: 'none', md: 'flex'}}>{ user.display_name }</Text>
    <ChevronDownIcon />
  </HStack>
))

export const ProfileDropdown = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Settings", icon: MixerHorizontalIcon, onClick: () => navigate('/settings') },
    //{ label: "Support guide", icon: BookmarkIcon, onClick: () => console.log("Support") },
    { label: "Changelog", icon: RowsIcon, onClick: () => window.open('https://changelog.finta.io', '_blank') },
    { label: "Logout", icon: ExitIcon, onClick: signOut}
  ]

  return (
    <Menu>
      <MenuButton>
        <DropdownButton user = { user! } />
      </MenuButton>
      <MenuList>
        <ShareFeedback />
        <MenuDivider />
        { menuItems
        .map(item => (
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