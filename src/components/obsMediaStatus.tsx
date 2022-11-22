import React, { useState, useEffect } from 'react'
import { css } from '@mui/styled-engine'
import OBSWebSocket from 'obs-websocket-js'

type Props = {
  obsUrl?: string,
  obsPassword?: string
}

export const ObsMediaStatus: React.FC<Props> = ({obsUrl, obsPassword}) => {

  const [isObsMonitoring, setIsObsMonitoring] = useState(false)
  // TODO: get current media input name using API
  const [mediaInputName, setMediaInputName] = useState({inputName: ''})
  const [mediaStatusInterval, setMediaStatusInterval] = useState()
  const [mediaStatusText, setMediaStatusText] = useState('')
  const [mediaStatusProgress, setMediaStatusProgress] = useState(0)


  const progressBarStyle = {backgroundColor: '#dddddd', width: mediaStatusProgress  + '%'}

  useEffect(() => {
    console.log(
      "Occurs ONCE, AFTER the initial render.", isObsMonitoring
    )

    const obs = new OBSWebSocket();
    obs.on('ConnectionError', err => {
      console.error('Socket error:', err)
    })
    
    obs.on('MediaInputPlaybackStarted', async inputName => {
      console.log('MediaInputPlaybackStarted', inputName)
      setMediaInputName(inputName)
    })
    
    obs.on('MediaInputActionTriggered', data => {
      console.log('MediaInputActionTriggered', data)
    })
    
    obs.on('MediaInputPlaybackEnded', async inputName => {
      console.log('MediaInputPlaybackEnded', inputName)
      setMediaInputName({inputName: ''})
    })
    
    
    async function connect() {
      await disconnect()
      try {
        console.log('Connecting to:', obsUrl, '- using password:', obsPassword)
        const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(obsUrl, obsPassword)
        console.log(`Connected to obs-websocket version ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
      } catch (e:any) {
        console.log(e)
      }
    }
    
    async function disconnect() {
      await obs.disconnect()
    }
    
    async function sendCommand(command: any, params: any) {
      try {
        return await obs.call(command, params || {})
      } catch (e) {
        console.log('Error sending command', command, ' - error is:', e.message)
        return {}
      }
    }
    
    function secToStr(n: number) {
      const min = Math.round(n / 60);
      const sec = Math.round(n % 60);
  
      return String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    }
  
    async function startObsMonitor() {
      setIsObsMonitoring(true)
      await connect()
  
      // TODO: Somehow, something updates the mediaInputName. This code should be moved at the beginning to set the initial 
      const inputList = await sendCommand('GetInputList', {inputKind: 'vlc_source'})
      inputList['inputs'].forEach(async (element:any) => {
        const inputName = {inputName: element['inputName']}
        const media = await sendCommand('GetMediaInputStatus', inputName)
        if (media['mediaState'] === 'OBS_MEDIA_STATE_PLAYING') {
          console.log('Found active media', media)
          setMediaInputName(inputName)
        }
      });

      let interval: any = setInterval(async () => {
        // console.log(mediaInputName['inputName'].length);
        if (mediaInputName['inputName'].length == 0) {
          return;
        }
  
        const media = await sendCommand('GetMediaInputStatus', mediaInputName)
        if (!media['mediaDuration']) {
          return;
        }
        console.log('mediastatus', media);
        const remaining = (media['mediaDuration'] - media['mediaCursor']) / 1000
        
        setMediaStatusProgress(media['mediaCursor'] / media['mediaDuration'] * 100)
        setMediaStatusText('total: ' + secToStr(media['mediaDuration'] / 1000)
          + ' passed: ' + secToStr(media['mediaCursor'] / 1000)
          + ' remaining: ' + secToStr(remaining))
  
      }, 1000)
      setMediaStatusInterval(interval)
  
    }

    startObsMonitor()
  }, []);

  return (
    <div>
      <div>{mediaInputName['inputName']}</div>
      <div>{mediaStatusText}</div>
      <div css={progressBarStyle}>&nbsp;</div>
    </div>
  )
}
