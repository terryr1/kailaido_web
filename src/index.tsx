import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css'
import './index.css'
import Home from './home'
import { MantineProvider } from '@mantine/core'
import { auth } from './firebase'
import Login from './login'
import type { User } from 'firebase/auth'
import { createBrowserRouter, Outlet, useNavigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import Dashboard from './dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

// 1. Define the App component
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log(currentUser)
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null; // Or a loading spinner

  if (!user) {
    navigate('auth')
  }

  return (
    <>
      <Outlet></Outlet>
    </>
  )

}

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "dashboard/:projectId", Component: Dashboard
      },

    ],
  },
  {
    path: "auth",
    Component: Login,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="light">{/* You need this for Mantine components */}
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>
)
