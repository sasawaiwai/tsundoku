'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  onDetected: (isbn: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let reader: import('@zxing/library').BrowserMultiFormatReader | null = null
    let active = true

    async function start() {
      const { BrowserMultiFormatReader } = await import('@zxing/library')
      reader = new BrowserMultiFormatReader()
      try {
        const devices = await reader.listVideoInputDevices()
        const deviceId = devices[devices.length - 1]?.deviceId
        if (!videoRef.current) return
        await reader.decodeFromVideoDevice(
          deviceId ?? null,
          videoRef.current,
          (result, err) => {
            if (result && active) {
              const text = result.getText()
              // ISBN-13 は 978 または 979 から始まる 13桁
              if (/^97[89]\d{10}$/.test(text)) {
                active = false
                onDetected(text)
              }
            }
            if (err && !(err.name === 'NotFoundException')) {
              setError(err.message)
            }
          }
        )
      } catch (e) {
        setError('カメラにアクセスできませんでした')
        console.error(e)
      }
    }

    start()

    return () => {
      active = false
      reader?.reset()
    }
  }, [onDetected])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-sm">
        <video ref={videoRef} className="w-full rounded-lg" />
        <div className="absolute inset-0 border-2 border-ake rounded-lg pointer-events-none" />
        <p className="text-center text-white text-sm mt-3">
          バーコードをカメラに向けてください
        </p>
        {error && <p className="text-center text-red-400 text-xs mt-2">{error}</p>}
      </div>
      <button
        onClick={onClose}
        className="mt-6 bg-white text-sumi px-6 py-2 rounded-full text-sm font-medium"
      >
        閉じる
      </button>
    </div>
  )
}
