import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import TouchableOpacity from '../components/TouchableOpacity';
import { auth } from '../firebase';
import { useNavigate } from 'react-router';
import { Center, Dialog, Button, Text, TextInput, Group } from '@mantine/core';
import { HeaderSimple } from '../components/header/HeaderSimple';

function Home() {
    const [prompt, setPrompt] = useState('');
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false)

    const dialog = (
        <Dialog opened={dialogOpen} position={{ top: "40%", left: "40%" }}>
            <Text size="sm" mb="xs" fw={500}>
                Describe your project:
            </Text>
            <Group align="flex-end">
                <TextInput placeholder="Type here..." style={{ flex: 1 }}
                    onChange={(event) => setPrompt(event.target.value)} />
                <Button onClick={async () => {
                    await createProject(prompt);
                }
                }>send</Button>
                <Button onClick={() => {
                    setDialogOpen(false)
                }
                }>Cancel</Button>
            </Group>
        </Dialog>
    );

    const createProject = async (message: string) => {
        const user = auth.currentUser;
        const token = await user?.getIdToken();

        console.log('fetching');
        console.log(token);

        try {
            const response = await fetch("api/project", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    initialPrompt: message,
                })
            });

            if (response.ok) {
                const projectId = await response.text()
                console.log('navigating to dashboard')
                setDialogOpen(false);
                navigate(`/dashboard/${projectId}`);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div style={styles.contentStyle}>
            {dialog}
            <HeaderSimple></HeaderSimple>
            <Center h="calc(100dvh - 46px)">
                <TouchableOpacity onClick={() => setDialogOpen(true)} aria-label="add" style={styles.button}>
                    <PlusIcon fontSize={24} />
                </TouchableOpacity>
            </Center>
        </div>
    )
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
        width: '100%'
    },
    main: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
    } as const //kinda hacky
}
export default Home
