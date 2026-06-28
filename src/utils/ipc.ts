export const send = (channel: string, data?: any) => {
  // @ts-ignore
  return window.electron?.send(channel, data)
}

export const receive = (channel: string, cb: (...args: any[]) => void) => {
  // @ts-ignore
  return window.electron?.receive(channel, cb)
}
