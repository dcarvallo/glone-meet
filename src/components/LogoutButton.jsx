import { useAuth0 } from "@auth0/auth0-react"
const LogoutButton = () => {
  const { logout } = useAuth0()

  function handleLogout(){
    localStorage.removeItem('room')
    logout();
  }

  return (
    <button id="logout" onClick={handleLogout }>Logout</button>
  )
}

export default LogoutButton