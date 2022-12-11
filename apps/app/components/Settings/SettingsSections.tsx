import {
  Card,
  CardBody,
  Stack
} from "@chakra-ui/react";
import { ReactElement } from "react";

import { SectionHeader } from "../Layout/SectionHeader";

export const SettingsSection = ({ title, description, children }: { title: string; description?: string; children: ReactElement | ReactElement[] }) => (
  <Stack as = "section" spacing = "2">
    <SectionHeader title = { title } description = { description } />
    <Card>
      <CardBody>
        <Stack spacing = "6">
          { children }
        </Stack>
      </CardBody>
    </Card>
  </Stack>
)