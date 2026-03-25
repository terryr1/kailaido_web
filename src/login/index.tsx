import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase';
import { HeaderSimple } from "../components/header/HeaderSimple";
import { Button, Center } from "@mantine/core";

function Login() {

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

  return (
    <div style={styles.contentStyle}>
      <HeaderSimple></HeaderSimple>
      <Center h="calc(100dvh - 46px)">
        <Button variant="default" onClick={() => {
          signIn();
        }}>
          Sign In
        </Button>
      </Center>
    </div >
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

export default Login
