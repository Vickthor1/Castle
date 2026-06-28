import React, { useEffect, useState } from 'react'
import { scanWindowsApps, addWindowsFolder, pickWindowsFolder } from '@/services/windowsIntegration'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function WindowsIntegrationPanel() {
  const [apps, setApps] = useState<any[]>([])
  useEffect(() => { void scanWindowsApps().then(setApps) }, [])
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="font-semibold">Integração Windows</div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => void scanWindowsApps().then(setApps)}>Atualizar</Button>
          <Button variant="ghost" onClick={() => void pickWindowsFolder().then((folder) => folder && addWindowsFolder(folder).then(() => scanWindowsApps().then(setApps)))}>Adicionar pasta</Button>
        </div>
      </div>
      <div className="text-sm text-white/60 mt-3">Aplicativos detectados: {apps.length}</div>
    </Card>
  )
}
