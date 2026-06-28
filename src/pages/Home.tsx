import React from 'react'
import Grid from '@/components/Grid'
import CardItem from '@/components/CardItem'
import WindowsIntegrationPanel from '@/components/WindowsIntegrationPanel'

export default function Home() {
  return (
    <div className="p-2 md:p-6">
      <Grid>
        <CardItem title="Integração Windows">
          <WindowsIntegrationPanel />
        </CardItem>
      </Grid>
    </div>
  )
}
