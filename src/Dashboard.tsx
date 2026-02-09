import { useState } from 'react'
import './App.css'
import { PlusIcon } from '@heroicons/react/24/solid'
import TouchableOpacity from './components/TouchableOpacity'

function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const dialog = (
    <dialog open={dialogOpen}>
      <p>sup friends</p>
      <form method="dialog">
        <button onClick={() => setDialogOpen(false)}>OK</button>
      </form>
    </dialog>
  );

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
