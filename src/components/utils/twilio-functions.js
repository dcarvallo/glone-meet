import { getRoomToken } from "../../scripts/getTokens";

export async function connect (
  otro,
  token,
  user,
  roomOwner,
  roomName,
  setToken,
  dataTrack,
  setRaiseHand,
  setEmojisUser,
  setParticipants,
  setIsConnected,
  setVideoTrack,
  localVideo,
  addLocalVideo,
  isConnected,
  enterAudio,
  setRoom,
  Video,
  setMicsOff,
  setMicToogle,
  createLocalVideoTrack,
  micToogle,
  setOpenModalParticipant,
  setNewParticipant
  ) {
  // console.log(roomName)
  let supToken
  if(!token){
    supToken = await getRoomToken({username: JSON.stringify({name: user.name, roomOwner: roomOwner}), roomName})
    localStorage.setItem('twilio-token', supToken)
    setToken(token)
  }
  else supToken = token
  let room2 
    //En prueba para validar si existe camara disponible
    // navigator.getUserMedia({
    //   video: {}
    //   },
    //   async () => {
    //     room2 = await Video.connect(token)
    //     room2.participants.forEach(participantConnected)
    //     room2.on('participantConnected', participantConnected)
    //     room2.on('participantDisconnected', participantDisconnected)
    //     setRoom(room2)
    // })

    // room2 = await Video.connect(supToken,{video : false, dominantSpeaker: true})
    room2 = await Video.connect(supToken, {dominantSpeaker: true})
    setRoom(room2)
    room2.localParticipant.publishTrack(otro);
    room2.on('participantConnected',par => participantConnected(par,roomOwner,setOpenModalParticipant,setParticipants,setNewParticipant))
    room2.on('dominantSpeakerChanged', dominantParticipant);
    room2.on('participantDisconnected', par => participantDisconnected(par, setParticipants))
    room2.on('disconnected', () => {
      localStorage.removeItem('room')
      localStorage.removeItem('twilio-token')
      window.location.reload()
    });

    const dataTrackPublished = {};

    dataTrackPublished.promise = new Promise((resolve, reject) => {
      dataTrackPublished.resolve = resolve;
      dataTrackPublished.reject = reject;
    });

    room2.localParticipant.on('trackPublished', publication => {
      if (publication.track === dataTrack) {
        dataTrackPublished.resolve();
      }
    });

    room2.localParticipant.on('trackPublicationFailed', (error, track) => {
      if (track === dataTrack) {
        dataTrackPublished.reject(error);
      }
    });

    room2.on('trackSubscribed', track => {
    
      if (track.kind === 'data') {
        track.on('message', async data => {
          let temp = JSON.parse(data)
          
          if(temp.personalMic){
            setMicsOff(prev => prev.includes(temp.sid) ?  prev.filter(el => el !== temp.sid) : [...prev, temp.sid])
          }
          if(temp.disableMics){
            setMicToogle(!micToogle)
            room2.localParticipant.audioTracks.forEach(track2 => {
              micToogle ? track2.track.disable() : track2.track.enable()
            });
            return
          }
          if(!temp.connect){
            if(temp.component === 'hand'){
              setRaiseHand(prev => prev.includes(temp.sid) ?  prev.filter(el => el !== temp.sid) : [...prev, temp.sid] )
              return
            }
            setEmojisUser(prev => [...prev, temp])
          }
          else{
            
            if(isConnected){
              let arrParticipants = []
              room2.participants.forEach(participant => {
                arrParticipants.push(participant)
              })
              setParticipants(...arrParticipants)
            }

            if(room2.localParticipant.sid == temp.sid){
              let arrParticipants = []
              room2.participants.forEach(participant => {
                arrParticipants.push(participant)
              })
              setParticipants(arrParticipants)
              setIsConnected(true)  
              const track2 = await createLocalVideoTrack()
              setVideoTrack(track2)
              track2.attach(localVideo.current)
              localVideo.current.style.transform = 'scale(-1, 1)'
            }
          }           
        });
      }
    });
    
    addLocalVideo()
    JSON.parse(room2.localParticipant.identity).roomOwner && setIsConnected(true)
    isConnected && enterAudio.current.play();
}

function participantConnected (participant,roomOwner,setOpenModalParticipant,setParticipants,setNewParticipant) {

  let usdata = JSON.parse(participant.identity)
  if(!usdata.name.includes('(share)')){

    roomOwner && setOpenModalParticipant(true)
    if(usdata.roomOwner) {
      setParticipants(prev => [...prev, participant])
    }
    setNewParticipant(prev => [...prev, participant,])
  }
  else acceptParticipant(participant)
}

function dominantParticipant(participant){
  // console.log('este es el participante dominante(Audio)', participant) 
}

function participantDisconnected (participant, setParticipants) {
  setParticipants((prevParticipants) =>
    prevParticipants.filter((p) => p !== participant)
  );
}

export function acceptParticipant(participant, enterAudio,Video,dataTrack,setParticipants,setNewParticipant) {
  enterAudio.current.play();
  const localDataTrack = new Video.LocalDataTrack();
  if(dataTrack){
    dataTrack.send(JSON.stringify({
      connect: true,
      sid: participant.sid
    }));
  }else {
    localDataTrack.send(JSON.stringify({
      connect: true,
      sid: participant.sid
    }));
  }
  setParticipants(prev => [...prev, participant])
  setNewParticipant(prevParticipants => prevParticipants.filter((p) => p !== participant))
}

export async function shareScreen(Video,user,roomName,enterAudio,room,setOptionsOpen,optionsOpen,setParticipants){
  let screenTrack
  let room2 
  navigator.mediaDevices.getDisplayMedia().then( async (stream) => {
    screenTrack = new Video.LocalVideoTrack(stream.getTracks()[0]);
    room2 = room.localParticipant.publishTrack(screenTrack);
    let token = await getRoomToken({username: JSON.stringify({name: user.name + ' (share)', roomOwner: false}), roomName})
    Video.connect(token, {dominantSpeaker: true, tracks: [screenTrack]})
    enterAudio.current.play();
    let participant
    screenTrack.once('stopped', async (track) => {
      room.participants.forEach(participant2 => {
       participant2.videoTracks.forEach(tra => {
         if(tra.trackName == track.id ){ 
         participant = participant2
        } })
      })
      removeParticipant(participant,roomName, setParticipants)
    }); 
    setOptionsOpen({...optionsOpen, open: false})

}).catch(() => {
    alert('Could not share the screen.')
});

}



















export function sendDataToRoom(data, sendWait,dataTrack,user,room,setSendWait, setEmojisOpen,emojisOpen){
  
  const randomPosition =  Math.floor(Math.random() * 100) + 0.95 + '%'
  !sendWait && dataTrack.send(JSON.stringify({
      component: data,
      user: user.name,
      time: 3000,
      position: randomPosition,
      sid: room.localParticipant.sid
    })); 
    setSendWait(true)
    setEmojisOpen({...emojisOpen, open: false})
    setTimeout(() => {
      setSendWait(false)
    }, 3000)
}

export function disconnect (leaveAudio,room) {
  leaveAudio.current && leaveAudio.current.play();
  setTimeout(() => {
    localStorage.removeItem('room')
    localStorage.removeItem('twilio-token')
    room.disconnect();
    window.location.reload()
  },1000)
}

export async function disconnectAll(leaveAudio,room,roomName) {
  try {
    const response = await fetch('/roomDisconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'roomName': roomName,
      })
    });
    disconnect(leaveAudio,room);
  } catch (error) {
    console.log(error)
  }
}

export async function removeParticipant(participant, roomName, setParticipants){
    
  try {
    await fetch('/removeParticipant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'roomName': roomName,
        'participantSid': participant.sid
      })
    });

    setParticipants((prevParticipants) =>
    prevParticipants.filter((p) => p !== participant)
    );
  } catch (error) {
    console.log(error)
  }
}