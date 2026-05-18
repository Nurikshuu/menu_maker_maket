'use client'

import dynamic from 'next/dynamic'

const CartDrawer = dynamic(() => import("@/components/layout/CartDrawer").then(m => ({ default: m.CartDrawer })), { ssr: false })
const AccountDrawer = dynamic(() => import("@/components/layout/AccountDrawer").then(m => ({ default: m.AccountDrawer })), { ssr: false })
const CitySelectModal = dynamic(() => import("@/components/layout/CitySelectModal").then(m => ({ default: m.CitySelectModal })), { ssr: false })
const ToastContainer = dynamic(() => import("@/components/ui/toast").then(m => ({ default: m.ToastContainer })), { ssr: false })

export function ClientProviders() {
  return (
    <>
      <CartDrawer />
      <AccountDrawer />
      <CitySelectModal />
      <ToastContainer />
    </>
  )
}
