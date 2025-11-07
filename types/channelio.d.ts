declare global {
  interface Window {
    ChannelIO?: IChannelIO
    ChannelIOInitialized?: boolean
    __channelScriptAppended?: boolean
    __channelBooted?: boolean
  }
}

interface IChannelIO {
  c?: (...args: any) => void
  q?: [methodName: string, ...args: any[]][]
  (...args: any): void
}

export {}

