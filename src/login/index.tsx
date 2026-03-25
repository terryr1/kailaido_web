import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase';

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
    <>
      <h1>Kailaido</h1>

      <div className="card">
        <p>Welcome to Kailaido !</p>
        <form method="dialog">
          <button onClick={() => {
            signIn();
          }
          }>Sign In</button>
        </form>
      </div>
    </>
  )
}

export default Login
