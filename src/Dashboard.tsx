import { useEffect, useState } from 'react'
import './App.css'
import { PlusIcon } from '@heroicons/react/24/solid'
import TouchableOpacity from './components/TouchableOpacity'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from './firebase';

function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const dialog = (
    <dialog open={dialogOpen}>
      <p>sup bbbgajdhf</p>
      <form method="dialog">
        <button onClick={() => {
          signIn();
          setDialogOpen(false)
        }
        }>Sign In</button>
        <button onClick={() => {
          echoAsync();
          setDialogOpen(false)
        }
        }>Echo</button>
      </form>
    </dialog>
  );

  const provider = new GoogleAuthProvider();

  const signIn = () => signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;

      console.log(user);
    }).catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...

      console.log(error);
    });

  const echoAsync = async () => {
    const user = auth.currentUser;
    const token = await user?.getIdToken();

    console.log('fetching');
    console.log(token);

    await fetch("api/echo", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "test message",
      })
    });
  }

  useEffect(() => {
    echoAsync();
  }, [])

  return (
    <>
      <h1>Kailaido</h1>
      {dialog}
      <div className="card">
        <TouchableOpacity onClick={() => setDialogOpen(true)} aria-label="add" style={styles.button}>
          <PlusIcon />
        </TouchableOpacity>
      </div>
    </>
  )
}

const styles = {
  button: {
    backgroundColor: 'none'
  }
}
export default Dashboard
