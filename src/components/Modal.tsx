import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type MouseEvent,
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

interface FlowProps {
  children: (api: { complete: (message: ReactNode) => void }) => ReactNode
}

export function Flow({ children }: FlowProps) {
  const { closeModal } = useModal()
  const [done, setDone] = useState<ReactNode | null>(null)

  if (done !== null) {
    return (
      <>
        <p role="status">{done}</p>
        <button type="button" className="button primary" onClick={closeModal}>
          Done
        </button>
      </>
    )
  }

  return <>{children({ complete: (message) => setDone(message) })}</>
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

  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) closeModal()
  }

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      <dialog id="modal" ref={dialogRef} aria-labelledby="modalTitle" onClick={onClick}>
        <button type="button" className="close" aria-label="Close dialog" onClick={closeModal}>
          &times;
        </button>
        <div id="modalBody">
          {content && (
            <>
              <h2 id="modalTitle">{content.title}</h2>
              {content.body}
            </>
          )}
        </div>
      </dialog>
    </ModalContext.Provider>
  )
}
