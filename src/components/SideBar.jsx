
import {
  Box,
  Divider,
  CssBaseline,
  Drawer,
  Typography
} from "@mui/material";
import {
  Apps,
  Menu,
  ContactMail,
  AssignmentInd,
  Home
} from "@mui/icons-material";
import ChatComponent from "./ChatComponent";


import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const themeLight = createTheme({
  palette: {
    background: {
      // default: "#222222"
    },
    text: {
      primary: "#000"
    }
  }
});
const SideBar = ({open,setOpen}) => {

  const toggleSlider = () => {
    setOpen(!open);
  };


  return (
    <>
      <ThemeProvider theme={themeLight}>
      <Box>
        <Drawer open={open} anchor="right" onClose={toggleSlider}>
          
            <Box>
            <Typography>
              Chat
            </Typography>
            <Divider />
            <ChatComponent room='textoroom' />
          </Box>
        </Drawer>
      </Box>
      </ThemeProvider>
    </>
  );
}

export default SideBar;