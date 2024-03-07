import { Heading, Html, Link, Section, Text } from "@react-email/components";

interface Props {
  url: string;
}

export function UserConfirm({ url }: Props) {
  return (
    <Html lang="en">
      <Heading as="h1">Welcome!</Heading>

      <Section>
        <Text>
          Please, <Link href={url}>click here</Link> to verify your account and
          start creating amazing content.
        </Text>
      </Section>
    </Html>
  );
}
