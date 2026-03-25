import { Avatar, Group, Text, Stack, Paper, Container, Box } from '@mantine/core';

interface CommentProps {
    userName: string;
    commentText: string;
    isAI?: boolean;
}

function CommentSimple({ userName, commentText, isAI }: CommentProps) {

    return (
        <Box
            w="100%" // Ensure the row takes full width
            style={{
                display: 'flex',
                justifyContent: isAI ? 'flex-start' : 'flex-end',
            }}
        >
            <Group
                align="flex-start"
                wrap="nowrap"
                dir={isAI ? 'ltr' : 'rtl'}
                style={{ maxWidth: '70%' }} // Limits the bubble width so it doesn't look like a thin strip
            >
                <Avatar radius="xl" color={isAI ? "blue" : "gray"}>
                    {userName.charAt(0)}
                </Avatar>

                <Stack gap={4} style={{ textAlign: isAI ? 'left' : 'right' }}>
                    <Text size="xs" c="dimmed" fw={700}>{userName}</Text>
                    <Paper
                        p="sm"
                        radius="lg"
                        bg={isAI ? 'var(--mantine-color-gray-1)' : 'blue'}
                        c={isAI ? 'black' : 'white'}
                    >
                        <Text size="sm">{commentText}</Text>
                    </Paper>
                </Stack>
            </Group>
        </Box>
    );

}

export function Chat({ messages }: { messages: CommentProps[] }) {
    return (
        <Container size="fluid" w="100%" p="md" style={{ width: '100%' }}>
            <Stack gap="md" w="100%" style={{ alignItems: 'stretch' }}>
                {messages.map((message, index) => (
                    <CommentSimple
                        key={index}
                        userName={message.userName}
                        commentText={message.commentText}
                        isAI={message.userName.toLowerCase() === 'kailaido_agent'}
                    />
                ))}
            </Stack>
        </Container>
    );
}