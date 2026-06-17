import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface ModalContent {
  title: string
  body: ReactNode
}

interface ModalApi {
  showModal: (title: string, body: ReactNode) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalApi | null>(null)

export function useModal(): ModalApi {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within a ModalProvider')
  return ctx
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [content, setContent] = useState<ModalContent | null>(null)

  const showModal = useCallback((title: string, body: ReactNode) => {
    setContent({ title, body })
    dialogRef.current?.showModal()
  }, [])

  const closeModal = useCallback(() => {
    dialogRef.current?.close()
  }, [])

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      <dialog id="modal" ref={dialogRef}>
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        <div id="modalBody">
          {content && (
            <>
              <p className="eyebrow">Prototype flow</p>
              <h2>{content.title}</h2>
              {content.body}
            </>
          )}
        </div>
      </dialog>
    </ModalContext.Provider>
  )
}
