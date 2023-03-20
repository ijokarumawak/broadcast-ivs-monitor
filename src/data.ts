type Data = {
  id: number
  name: string
  videoPlatform: string
  videoId: string
  obsUrl?: string
  obsPassword?: string
}

export const data: Array<Data> = [
  {
    id: 29,
    name: 'A',
    videoPlatform: 'ivs',
    videoId:
      'https://294fdb0f5e90.us-east-1.playback.live-video.net/api/video/v1/us-east-1.607167088920.channel.LJst1Bb2o3eq.m3u8',
    obsUrl: 'https://elk.cloudnativedays.jp/obs-monitor-api/media-progress/A',
  },
  {
    id: 30,
    name: 'B',
    videoPlatform: 'ivs',
    videoId:
      'https://294fdb0f5e90.us-east-1.playback.live-video.net/api/video/v1/us-east-1.607167088920.channel.g9ZfIZVvPmVb.m3u8',
    obsUrl: 'https://elk.cloudnativedays.jp/obs-monitor-api/media-progress/B',
  },
  {
    id: 31,
    name: 'C',
    videoPlatform: 'ivs',
    videoId:
      'https://294fdb0f5e90.us-east-1.playback.live-video.net/api/video/v1/us-east-1.607167088920.channel.8UjYSfSj653l.m3u8',
    obsUrl: 'https://elk.cloudnativedays.jp/obs-monitor-api/media-progress/C',
  },
]
