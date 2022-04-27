import {useEffect} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';

const GNavbar = () => {
  const {isAuthenticated, isLoading ,user} = useAuth0();
  
  
  return (
    <div id='navbar'>
      <Typography >C-Google-Meet</Typography >
      <div>
        { isAuthenticated && 
        <div id='username'>
          <Avatar src={user.picture} />
          <span>{user.name}</span> 
          <LogoutButton />
          <pre>
          </pre>
        </div>}
        {!isAuthenticated &&
          
         <LoginButton /> }
      </div>
    </div>
  )
}

export default GNavbar