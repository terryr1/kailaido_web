import { Burger, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <header style={styles.header}>
      <Container size="md" style={styles.inner}>
        <text>Kailaido</text>

        {/* <Group gap={5} visibleFrom="xs">
          {items}
        </Group> */}

        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="xs"
          size="sm"
          aria-label="Toggle navigation"
        />
      </Container>
    </header>
  );
}

const styles = {
  button: {
    backgroundColor: 'none',
    width: 100,
    height: 100
  },
  layoutStyle: {
    display: 'flex',
    width: '100vw',
  },
  contentStyle: {
    flex: 1,
    padding: '20px',
    overflow: 'auto',
  },
  header: {
    height: 46, // Note: 2vh is very small, Mantine headers are usually ~56px
    backgroundColor: 'var(--mantine-color-body)',
    borderBottom: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
  },
  inner: {
    height: 46,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: 'var(--mantine-radius-sm)',
    textDecoration: 'none',
    color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0))',
    fontSize: 'var(--mantine-font-size-sm)',
    fontWeight: 500,

    // Hover translation
    '&:hover': {
      backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
    },

    // Active state translation (using data attributes)
    '&[data-active]': {
      backgroundColor: 'var(--mantine-color-blue-filled)',
      color: 'var(--mantine-color-white)',
    },
  }
}