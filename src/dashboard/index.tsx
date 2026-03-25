import { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { useParams } from 'react-router';
import { Tabs, Card, Table, Accordion, Text, Title, Stack, AppShell, Box, Container, type TableData, ActionIcon, useMantineTheme, Group } from '@mantine/core';
import { DashboardInput } from '../components/dashboardinput';
import { IconMessages, IconMessagesOff } from '@tabler/icons-react';
import { Chat } from '../components/chat';

interface ComponentSpec {
    componentType: 'TABS' | 'CARD' | 'TABLE' | 'ACCORDION';
    title?: string;
    content?: string;
    tabs?: { title: string; children: ComponentSpec[] }[];
    tableId?: string;
    // Add other props as needed for Table/Accordion
}

function Dashboard() {
    const [dashboardConfig, setDashboardConfig] = useState<ComponentSpec>({ componentType: "TABS", tabs: [] });
    const [tables, setTables] = useState<Record<string, any[]>>({})
    const [prompt, setPrompt] = useState('');
    const [showChat, setShowChat] = useState(false);
    const { projectId } = useParams<{ projectId: string }>();
    const theme = useMantineTheme();
    const [messages, setMessages] = useState([])

    // const navigate = useNavigate();

    useEffect(() => {
        loadUI()
        getTables();
    }, [])

    const loadUI = async () => {
        const user = auth.currentUser;
        const token = await user?.getIdToken();

        console.log(`make api call ${projectId}`)

        const response = await fetch(`/api/project/${projectId}/config`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        const jsonRes = await response.json()
        console.log(jsonRes)

        setDashboardConfig(jsonRes.dashboard);
        setMessages(jsonRes.messages.map((message: { CreatedBy: any; Content: any; }) =>
            ({ userName: message.CreatedBy, commentText: message.Content })));
    }

    const promptAsync = async () => {
        console.log('start prompt api call: ' + prompt)

        if (prompt.length == 0) {
            console.log('empty prompt: ' + prompt)
            return;
        }

        const user = auth.currentUser;
        const token = await user?.getIdToken();

        console.log('fetching');
        console.log(token);

        try {
            const response = await fetch(`/api/project/${projectId}/prompt`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt,
                })
            });

            if (response.ok) {
                console.log(await response.text());
                setPrompt("")
                loadUI()
                getTables();
            } else {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getTables = async () => {
        const user = auth.currentUser;
        const token = await user?.getIdToken();

        console.log('fetching');
        console.log(token);

        try {
            const response = await fetch(`/api/project/${projectId}/tables`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const res = await response.json();
                setTables(res);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }
    console.log(dashboardConfig)
    return (
        <AppShell
            // navbar={{
            //     width: 80, // Match the width of your NavbarMinimal
            //     breakpoint: 'sm',
            // }}
            padding="md"
        >
            {/* <AppShell.Navbar>
                <NavbarMinimal />
            </AppShell.Navbar> */}
            <AppShell.Main>
                <div style={{ position: 'relative', display: 'block' }}>
                    {/* The actual component you want to mask */}
                    {showChat ? <Chat messages={messages} /> :
                        <DashboardRenderer specs={[dashboardConfig]} tables={tables} />}
                </div>

                <Box
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0, //80, // Navbar width
                        right: 0,
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 100, // Ensure it stays above the DashboardRenderer
                    }}
                >
                    <Container w="100%" h={65} p={0}>
                        <Group wrap="nowrap" gap="xs" align="center" style={{ height: '100%' }}>
                            <DashboardInput
                                style={{ flex: 1 }} // This makes the input take up all remaining space
                                onChange={event => setPrompt(event.currentTarget.value)}
                                onSearchClick={() => promptAsync()}
                            />

                            <ActionIcon
                                size={32}
                                radius="xl"
                                color={theme.primaryColor}
                                variant="filled"
                                aria-label="Search"
                                onClick={() => setShowChat(!showChat)}
                            >
                                {showChat ? <IconMessagesOff size={18} stroke={1.5} /> :
                                    <IconMessages size={18} stroke={1.5} />}
                            </ActionIcon>
                        </Group>
                    </Container>
                </Box>
            </AppShell.Main>
        </AppShell>
    )
}

const DashboardRenderer = ({ specs, tables }: { specs: ComponentSpec[], tables: Record<string, any[]> }) => {
    console.log('dashboard renderer called')
    return (
        <Stack gap="md">
            {specs.map((spec, index) => (
                <RenderComponent key={index} spec={spec} tables={tables} />
            ))}
        </Stack>
    );
};

const RenderComponent = ({ spec, tables }: { spec: ComponentSpec, tables: Record<string, any[]> }) => {
    switch (spec.componentType) {
        case 'TABS':
            if (!spec.tabs || spec.tabs.length === 0) {
                return null; // Or a loader/skeleton
            }
            return (
                <Tabs variant='outline' defaultValue={spec.tabs?.[0]?.title}>
                    <Tabs.List>
                        {spec.tabs?.map((tab, index) => {
                            return (
                                <Tabs.Tab key={index} value={tab.title}>
                                    {tab.title}
                                </Tabs.Tab>
                            )
                        })}
                    </Tabs.List>

                    {spec.tabs?.map((tab) => (
                        <Tabs.Panel key={tab.title} value={tab.title} pt="xs">
                            {/* Recursive call to render children inside the tab */}
                            <DashboardRenderer specs={tab.children} tables={tables} />
                        </Tabs.Panel>
                    ))}
                </Tabs>
            );
        case 'ACCORDION':
            if (!spec.tabs || spec.tabs.length === 0) {
                return null; // Or a loader/skeleton
            }
            return (
                <Accordion variant='contained' defaultValue={spec.tabs?.[0]?.title}>
                    {spec.tabs?.map((item, index) => (
                        <Accordion.Item key={index} value={item.title}>
                            <Accordion.Control >{item.title}</Accordion.Control>
                            <Accordion.Panel>
                                <DashboardRenderer specs={item.children} tables={tables} />
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            );

        case 'CARD':
            return (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    {spec.title && (
                        <Card.Section withBorder inheritPadding py="xs">
                            <Title order={4}>{spec.title}</Title>
                        </Card.Section>
                    )}
                    <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-wrap' }} mt="md">
                        {spec.content}
                    </Text>
                </Card>
            );
        case 'TABLE':
            console.log(`getting table for ${spec.tableId}`)
            const rows = tables[spec.tableId || ""] || [];

            // 2. Derive headers only if data exists
            const head = rows.length > 0
                ? Object.keys(rows[0])
                : [];

            // 3. Map values, ensuring we handle potential null/undefined values in cells
            const body = rows.map(obj =>
                Object.values(obj).map(val => (val === null || val === undefined ? '' : String(val)))
            );

            const tableData: TableData = { head, body };

            return <Table data={tableData} withTableBorder highlightOnHover withColumnBorders />;
        default:
            return <></>;
    }
};

export default Dashboard
