export const send = (channel: string, data?: unknown) => {
  // @ts-ignore
  return window.electron?.send(channel, data)
}

export const receive = (channel: string, cb: (...args: unknown[]) => void) => {
  // @ts-ignore
  return window.electron?.receive(channel, cb)
}
