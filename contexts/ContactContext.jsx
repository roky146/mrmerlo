import { createContext, useContext, useState, useCallback } from 'react'
import ContactModal from '../components/ContactModal'

const ContactCtx = createContext({ open: () => {} })

export function ContactProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <ContactCtx.Provider value={{ open }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={close} />
    </ContactCtx.Provider>
  )
}

export const useContact = () => useContext(ContactCtx)
