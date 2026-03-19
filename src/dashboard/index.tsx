import { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { NavbarMinimal } from '../components/sidebar/Sidebar';
import { useNavigate, useParams } from 'react-router';
import { Tabs, Card, Table, Accordion, Text, Title, Stack, AppShell, TextInput, Box, Container, Paper, type TableData } from '@mantine/core';
import { DashboardInput } from '../components/dashboardinput';

interface ComponentSpec {
    componentType: 'TABS' | 'CARD' | 'TABLE' | 'ACCORDION';
    title?: string;
    content?: string;
    tabs?: { title: string; children: ComponentSpec[] }[];
    tableId?: string;
    // Add other props as needed for Table/Accordion
}

function Dashboard() {
    const [dashboardConfig, setDashboardConfig] = useState<ComponentSpec[]>([]);
    const [tables, setTables] = useState<Record<string, any[]>>({})
    const [prompt, setPrompt] = useState('');
    const { projectId } = useParams<{ projectId: string }>();

    // const navigate = useNavigate();

    console.log("rendering dashboard")

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

        setDashboardConfig(jsonRes);
    }

    const promptAsync = async () => {
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
                    projectId: 'test_project_id',
                    message: prompt,
                })
            });

            if (response.ok) {
                console.log(await response.text());
            } else {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
        setPrompt("")
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
                console.log(res)
                setTables(res);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }


    console.log(`rendering the dashboard now`);
    console.log(dashboardConfig)
    return (
        <AppShell
            navbar={{
                width: 80, // Match the width of your NavbarMinimal
                breakpoint: 'sm',
            }}
            padding="md"
        >
            <AppShell.Navbar>
                <NavbarMinimal />
            </AppShell.Navbar>
            <AppShell.Main>
                <DashboardRenderer specs={dashboardConfig} tables={tables} />

                <Box
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 80, // Navbar width
                        right: 0,
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 100, // Ensure it stays above the DashboardRenderer
                    }}
                >
                    <Container w="100%" h={65} p={0}>
                        <DashboardInput
                            onChange={event => setPrompt(event.currentTarget.value)}
                            onClick={() => promptAsync()}>
                        </DashboardInput>
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

            return <Table data={tableData} withTableBorder />;
        default:
            return <></>;
    }
};

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
    }
}
export default Dashboard
