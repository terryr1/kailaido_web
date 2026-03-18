import { IconArrowRight } from '@tabler/icons-react';
import { ActionIcon, TextInput, type TextInputProps, useMantineTheme } from '@mantine/core';

interface DashboardInputProps extends TextInputProps {
    onSearchClick?: () => void; // A specific name helps avoid conflicts
}

export function DashboardInput(props: DashboardInputProps) {
    const theme = useMantineTheme();

    return (
        <TextInput
            radius="xl"
            size="md"
            placeholder="Type here..."
            rightSectionWidth={42}
            rightSection={
                <ActionIcon
                    size={32}
                    radius="xl"
                    color={theme.primaryColor}
                    variant="filled"
                    aria-label="Search"
                    onClick={props.onSearchClick}
                >
                    <IconArrowRight size={18} stroke={1.5} />
                </ActionIcon>
            }
            aria-label="Type here..."
            {...props}
        />
    );
}