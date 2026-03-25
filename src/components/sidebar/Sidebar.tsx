import { useState } from 'react';
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
  IconUser,
} from '@tabler/icons-react';
import { Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from './NavbarMinimal.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
        aria-label={label}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconGauge, label: 'Dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconCalendarStats, label: 'Releases' },
  { icon: IconUser, label: 'Account' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' },
];

export function NavbarMinimal() {
  const [active, setActive] = useState(2);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}

// .navbar {
//     width: 80px;
//     height: 750px;
//     padding: var(--mantine-spacing-md);
//     display: flex;
//     flex-direction: column;
//     border-right: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
//   }
  
//   .navbarMain {
//     flex: 1;
//     margin-top: 50px;
//   }
  
//   .link {
//     width: 50px;
//     height: 50px;
//     border-radius: var(--mantine-radius-md);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0));
  
//     &:hover {
//       background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5));
//     }
  
//     &[data-active] {
//       &,
//       &:hover {
//         background-color: var(--mantine-color-blue-light);
//         color: var(--mantine-color-blue-light-color);
//       }
//     }
//   }