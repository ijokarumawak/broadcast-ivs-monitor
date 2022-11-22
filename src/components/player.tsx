import React, { useEffect, useRef } from 'react'
import videojs, { VideoJsPlayer } from 'video.js'
import 'video.js/dist/video-js.css'
import { ObsMediaStatus } from './obsMediaStatus'

declare function registerIVSTech(
  vjs: typeof videojs,
  config?: { wasmWorker: string; wasmBinary: string },
): void

type Props = {
  playBackUrl?: string,
  obsUrl?: string,
  obsPassword?: string
}

export const Player: React.FC<Props> = ({ playBackUrl, obsUrl, obsPassword }) => {
  const playerRef = useRef<VideoJsPlayer>()
  const videoElement = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://player.live-video.net/1.10.0/amazon-ivs-videojs-tech.min.js'
    document.body.appendChild(script)

    script.addEventListener('load', () => {
      if (!videoElement.current) return
      registerIVSTech(videojs)
      const player = videojs(
        videoElement.current,
        {
          techOrder: ['AmazonIVS'],
          autoplay: true,
        },
        () => {
          console.log('Player is ready to use!')
          if (playBackUrl) player.src(playBackUrl)
        },
      )
      playerRef.current = player
    })

    return () => {
      if (playerRef.current) playerRef.current.dispose()
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div>
      <video
        ref={videoElement}
        className="video-js vjs-16-9 vjs-big-play-centered"
        controls
        autoPlay
        playsInline
        muted={false}
      />
      <ObsMediaStatus
        obsUrl={obsUrl}
        obsPassword={obsPassword}
       />
    </div>
  )
}
