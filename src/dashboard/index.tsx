import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import TouchableOpacity from '../components/TouchableOpacity';
import { auth } from '../firebase';
import { HeaderSimple } from '../components/header/HeaderSimple';
import { NavbarMinimal } from '../components/sidebar/Sidebar';
import { useNavigate } from 'react-router';

function Dashboard() {
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  console.log("rendering dashboard")

  const echoAsync = async (message: string) => {
    const user = auth.currentUser;
    const token = await user?.getIdToken();

    console.log('fetching');
    console.log(token);

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

    setResponseMessage(await response.text());
  }

  return (
    <div style={styles.contentStyle}>
      <div>
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
  }
}
export default Dashboard
