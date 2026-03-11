import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import TouchableOpacity from '../components/TouchableOpacity';
import { auth } from '../firebase';
import classes from './index.module.css';
import { HeaderSimple } from '../components/header/HeaderSimple';
import { NavbarMinimal } from '../components/sidebar/Sidebar';
import { useNavigate } from 'react-router';

function Home() {
    const [prompt, setPrompt] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false)

    const dialog = (
        <dialog open={dialogOpen}>
            <p>sup bbbgajdhf</p>
            <form method="dialog">
                <input
                    id="msg-input"
                    type="text"
                    value={prompt} // 3. Bind the value to the state
                    onChange={(event) => setPrompt(event.target.value)} // 4. Update the state as the user types
                    placeholder="Type here..."
                />
                <button onClick={async () => {
                    await echoAsync(prompt);
                    console.log('navigating to dashboard')
                    navigate("/dashboard");
                    setDialogOpen(false);
                    setPrompt("");
                }
                }>send</button>
                <button onClick={() => {
                    setDialogOpen(false)
                }
                }>Cancel</button>
            </form>
        </dialog>
    );

    const echoAsync = async (message: string) => {
        const user = auth.currentUser;
        const token = await user?.getIdToken();

        console.log('fetching');
        console.log(token);

        try {
            const response = await fetch("api/echo", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: message,
                })
            });

            if (response.ok) {
                setResponseMessage(await response.text());
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
            <div style={styles.main}>
                <TouchableOpacity onClick={() => setDialogOpen(true)} aria-label="add" style={styles.button}>
                    <PlusIcon fontSize={24} />
                </TouchableOpacity>
            </div>
            <div>
                {responseMessage}
            </div>
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
        flex: 1,
        padding: '20px',
        overflow: 'auto',
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
