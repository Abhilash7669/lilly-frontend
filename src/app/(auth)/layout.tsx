import CanvaProvider from '@/lib/provider/canva-provider';
import React from 'react'

type Props = {
    children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <CanvaProvider>
        {children}
    </CanvaProvider>
  )
}