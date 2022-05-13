import { IconButton, Menu, MenuItem } from "@mui/material"
import { Box } from "@mui/system"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PanToolIcon from '@mui/icons-material/PanTool';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const reactions = [
  {name:'thumb', component: <ThumbUpIcon /> },
  {name:'smile', component: <TagFacesIcon />},
  {name:'sad', component: <SentimentVeryDissatisfiedIcon />},
  {name:'hand', component: <PanToolIcon />}
]

const EmojisMenu = ({emojisOpen,openEmojisMenu,setEmojisOpen,sendDataToRoom}) => {
  return (
   
    <IconButton style={{backgroundColor: 'yellow'}}
      id="basic-button"
      aria-controls={emojisOpen.open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={emojisOpen.open ? 'true' : undefined}
      onClick={openEmojisMenu}
      >
        <TagFacesIcon />
      
        <Menu
          id="basic-menu"
          anchorEl={emojisOpen.anchorEl}
          open={emojisOpen.open}
          onClose={() => setEmojisOpen(!emojisOpen)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <Box style={{display: 'flex'}}>
            {reactions.map(reaction => (
              <MenuItem onClick={() => sendDataToRoom(reaction.name)}><IconButton style={{backgroundColor: 'black', color: 'yellow'}}>{reaction.component}</IconButton></MenuItem>
            ))}
          {/* <MenuItem onClick={() => sendDataToRoom('smile')}><IconButton style={{backgroundColor: 'black',color: 'yellow'}}></IconButton></MenuItem>
          <MenuItem onClick={() => sendDataToRoom('sad')}><IconButton style={{backgroundColor: 'black',color: 'yellow'}}><SentimentVeryDissatisfiedIcon /></IconButton></MenuItem>
          <MenuItem onClick={() => sendDataToRoom('hand')}><IconButton style={{backgroundColor: 'black',color: 'yellow'}}><PanToolIcon /></IconButton></MenuItem> */}
        </Box>
          
        </Menu>
    </IconButton>
  )
}

export default EmojisMenu