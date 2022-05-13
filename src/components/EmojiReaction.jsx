import {useEffect ,useState} from 'react'

import { IconButton, Typography } from "@mui/material"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';


const EmojiReaction = ({reaction,position}) => {
  const [visible, setVisible] = useState(true);
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer)
  }, []);

  function renderSwitch(param) {
    switch(param) {
      case 'thumb':
        return <ThumbUpIcon />;
      case 'smile':
        return <TagFacesIcon />;
      case 'sad':
        return  <SentimentVeryDissatisfiedIcon /> ;
      default:
        return '';
    }
  }
  
  return visible && (
      <div style={styles.container(position)} > 
        <IconButton style={styles.icon}> {renderSwitch(reaction.component)}  </IconButton>
        <Typography style={styles.name}> {reaction.user} </Typography> 
      </div>
  ) 
  
}

const styles = {
  container: {},
  container: (position) => ({
    display: 'flex', flexDirection: 'column', justifyContent:'center',left: position
  }),
  icon:{color: 'yellow',fontSize: "30px"},
  name: {fontSize: '13px'}
}

export default EmojiReaction