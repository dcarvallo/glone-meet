
import EmojiReaction from "./EmojiReaction"

const VideoLocal = ({user,handleFullScreen, localVideo, videoToogle,emojisUser,setEmojisUser, localAudio,micToogle,height}) => {

  return (
    <div id="local" className="participant">
      
        <video onDoubleClick={handleFullScreen} ref={localVideo}  style={{ height, width: '100%' , objectFit: "cover", borderRadius:"7px", position: 'relatve'}} autoPlay={videoToogle} />
        <p style={{position: 'absolute', bottom: '-15px', zIndex:'9'}} >{user.name}</p>
          
          { emojisUser.length > 0 && emojisUser.map((reaction,index) => {
          let time = setTimeout(() => {
            setEmojisUser(prev => prev.splice(index, 1))
          },reaction.time)
          clearTimeout(time)
          return <div className='emojis'>
            <EmojiReaction reaction={reaction} position={reaction.position}/> 
          </div>
          
          })
          }
        <audio ref={localAudio} autoPlay={false} muted={micToogle} />
      {/* </Box>     */}
    </div>
  )
}

export default VideoLocal