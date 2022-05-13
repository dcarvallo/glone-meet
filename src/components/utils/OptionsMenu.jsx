import { IconButton, Menu, MenuItem, Typography } from "@mui/material"
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import GridViewIcon from '@mui/icons-material/GridView';

const OptionsMenu = ({optionsOpen, openOptionsMenu,shareScreen,shareToogle,handleFullScreen,fullScreenToogle,setModalViews,setOptionsOpen}) => {
  return (
    <IconButton style={{backgroundColor: 'white'}}
                  id="basic-button2"
                  aria-controls={optionsOpen.open ? 'basic-menu2' : undefined}
                  aria-haspopup="true"
                  aria-expanded={optionsOpen.open ? 'true' : undefined}
                  onClick={openOptionsMenu}
                  >
                    <MoreVertIcon />
                    <Menu
                    // style={{ position:'absolute'}}
                      id="basic-menu2"
                      anchorEl={optionsOpen.anchorEl}
                      open={optionsOpen.open}
                      onClose={() => setOptionsOpen(!optionsOpen)}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button2',
                      }}
                    >
                      <MenuItem onClick={shareScreen}><IconButton style={{ backgroundColor: shareToogle ? 'red' : 'white'}} >{shareToogle ? <PresentToAllIcon /> : <CancelPresentationIcon />} <Typography> Share Screen</Typography></IconButton> </MenuItem>
                      <MenuItem onClick={handleFullScreen}><IconButton>{ fullScreenToogle ? <FullscreenExitIcon /> : <FullscreenIcon />} <Typography> Full Screen</Typography> </IconButton> </MenuItem>
                      <MenuItem onClick={() => setModalViews(true)}> <IconButton > <GridViewIcon /> <Typography> Change View </Typography></IconButton></MenuItem>
                    </Menu>
                  
                </IconButton>
  )
}

export default OptionsMenu