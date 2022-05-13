import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  
  const { loginWithRedirect } = useAuth0();
  const  glogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png'
  return (
      <div>
        <button id="gbutton" variant="contained" onClick={() => loginWithRedirect()}>
          <img style={{width: "20px", marginRight:'10px'}} src={glogo} />
          Login with Google
        </button>

      </div>
  );
};

export default Login;
