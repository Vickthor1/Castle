export type AppItem = {
  id: string
  name: string
  category?: string
  icon?: string // url or base64
  favorite?: boolean
  path?: string
  sourceType?: 'exe' | 'lnk'
}
