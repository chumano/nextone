import classnames from "classnames"
import React, { ReactEventHandler, useEffect, useRef } from "react"

export interface StreamWithURL {
    stream: MediaStream
    streamId: string
    url?: string
}

export interface VideoProps {
    stream?: StreamWithURL
    muted?: boolean

    nickname?: string
    peerId?: string
    mirrored?: boolean
    play?: () => void
    localUser?: boolean
  }
  
 const  Video : React.FC<VideoProps> = (props)=> {
    const videoRef = useRef<HTMLVideoElement|any>();
  
    const { stream , muted} = props
   
    useEffect(()=>{
      const video = videoRef.current;
      if (video) {
        const mediaStream = stream?.stream;
        const url = stream?.url
        if ('srcObject' in video as unknown) {
          if (mediaStream && video.srcObject !== mediaStream) {
            video.srcObject = mediaStream
          }
        } else if (video.src !== url) {
          video.src = url || ''
        }
        video.muted = !!props.muted;
      }
    },[stream, muted, videoRef.current])
    
    const handleClick: ReactEventHandler<HTMLVideoElement> = () => {
       playVideo();
    }

    const playVideo = ()=>{
        props.play && props.play()
    }

    const handleMinimize = () => {
    //   props.onMinimizeToggle({
    //     peerId: this.props.peerId,
    //     streamId: this.props.stream && this.props.stream.streamId,
    //   })
    }
    const handleToggleCover = () => {
      const v = videoRef.current
      if (v) {
        v.style.objectFit = v.style.objectFit ? '' : 'contain'
      }
    }

    const { mirrored, peerId } = props
    //const minimized =  windowState === 'minimized'
    const className = classnames('video-container', {
      //minimized,
      mirrored,
      'none-display' : !stream
    })

    //const streamId = props.stream && props.stream.streamId;
      return (
        <div className={className}>
          <video
            autoPlay
            onClick={handleClick}
            onLoadedMetadata={() => playVideo()}
            playsInline
            ref={videoRef}
          />

          {/* <div className='video-footer'>
            <VUMeter streamId={streamId} />
            <span className='nickname'>{props.nickname}</span>
            <Dropdown label={<MdMenu />}>
              <li className='action-minimize' onClick={handleMinimize}>
                {minimized ? <MdZoomIn /> : <MdZoomOut /> }&nbsp;
                {minimized ? 'Maximize': 'Minimize' }
              </li>
              <li className='action-toggle-fit' onClick={this.handleToggleCover}>
                <MdCrop /> Toggle Fit
              </li>
            </Dropdown>
          </div> */}

        </div>
      )
    }
  
export default Video;