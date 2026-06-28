import React from 'react'
import { motion } from 'framer-motion'
import Grid from '@/components/Grid'
import CardItem from '@/components/CardItem'
import WindowsIntegrationPanel from '@/components/WindowsIntegrationPanel'

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="p-2 md:p-6">
      <Grid>
        <CardItem title="Integração Windows">
          <WindowsIntegrationPanel />
        </CardItem>
      </Grid>
    </motion.div>
  )
}
