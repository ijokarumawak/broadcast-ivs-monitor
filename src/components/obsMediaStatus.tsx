import React, { useState, useEffect } from 'react'

type Props = {
  obsUrl?: string
  obsPassword?: string
}

export const ObsMediaStatus: React.FC<Props> = ({ obsUrl, obsPassword }) => {
  const [mediaInputName, setMediaInputName] = useState('')
  const [mediaStatusText, setMediaStatusText] = useState('')
  const [mediaStatusProgress, setMediaStatusProgress] = useState(0)

  const progressBarStyle = {
    backgroundColor: '#337868',
    width: mediaStatusProgress + '%',
  }

  useEffect(() => {
    function secToStr(n: number) {
      const min = Math.round(n / 60)
      const sec = Math.round(n % 60)

      return String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0')
    }

    const interval = setInterval(async () => {
      if (obsUrl === undefined || obsUrl === null || obsUrl.length === 0) {
        return
      }
      fetch(obsUrl)
        .then((response) => response.json())
        .then((media) => {
          console.log(media)

          if (!media['mediaDuration']) {
            setMediaInputName('')
            setMediaStatusText('')
            setMediaStatusProgress(0)
            return
          }
          console.log('media', media)

          setMediaInputName(media['inputName'])

          const remaining =
            (media['mediaDuration'] - media['mediaCursor']) / 1000

          setMediaStatusProgress(
            (media['mediaCursor'] / media['mediaDuration']) * 100,
          )
          setMediaStatusText(
            'total: ' +
              secToStr(media['mediaDuration'] / 1000) +
              ' passed: ' +
              secToStr(media['mediaCursor'] / 1000) +
              ' remaining: ' +
              secToStr(remaining),
          )
        })
    }, 1000)
    return () => clearInterval(interval)
  })

  return (
    <div>
      <div>{mediaInputName}</div>
      <div>{mediaStatusText}</div>
      <div css={progressBarStyle}>&nbsp;</div>
    </div>
  )
}
