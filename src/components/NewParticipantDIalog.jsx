import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import React from 'react'

const NewParticipantDIalog = ({openModalParticipant,participant,newParticipant, acceptAll,rejectParticipant,acceptParticipant,other}) => {
  return (
    <Dialog
      style={{padding: '5px', margin:'2px'}}
        open={openModalParticipant}
        PaperProps={{ sx: { position: "fixed", top: 15, m: 0, p: '18px' ,height: '200px'} }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
          <DialogTitle>
            <Typography style={{color: 'black'}}> New Participant</Typography>
          </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography> <strong>{JSON.parse(participant.identity).name} </strong> wants to enter the room</Typography> 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {newParticipant.length > 1 && <Button color="primary" onClick={acceptAll}>Accept All</Button> }
          <Button color="primary" onClick={() => rejectParticipant(participant)}>Reject</Button>
          <Button color="secondary" onClick={() => acceptParticipant(participant,other[0],other[1],other[2],other[3],other[4])}>Accept</Button>
        </DialogActions>
      </Dialog>
            
  )
}

export default NewParticipantDIalog