import { useEffect, useState } from 'react'
import { translate } from '@/i18n/i18n'
import { isLinux } from './app-window-chrome'

// Why: Windows uses right-aligned Win11 buttons. Linux uses left-aligned macOS/MacTahoe traffic lights (close, minimize, maximize).
export function WindowControls(): React.JSX.Element {
  const [maximized, setMaximized] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // Why: maximize-changed only fires on transitions; seed from main on mount so a startup-maximized window shows the right icon.
    let cancelled = false
    void window.api.ui.isMaximized().then((value) => {
      if (!cancelled) {
        setMaximized(value)
      }
    })
    const unsubscribe = window.api.ui.onMaximizeChanged(setMaximized)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  if (isLinux) {
    return (
      <div
        className="window-controls-left"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className="traffic-light traffic-light-close"
          aria-label={translate('auto.App.e960d18540', 'Close')}
          onClick={() => window.api.ui.requestClose()}
          title={translate('auto.App.e960d18540', 'Close')}
        >
          {hovered && (
            <svg width="6" height="6" viewBox="0 0 6 6" className="traffic-light-icon" aria-hidden>
              <path
                d="M1 1L5 5M5 1L1 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="traffic-light traffic-light-minimize"
          aria-label={translate('auto.App.bbb7f90669', 'Minimize')}
          onClick={() => window.api.ui.minimize()}
          title={translate('auto.App.bbb7f90669', 'Minimize')}
        >
          {hovered && (
            <svg width="6" height="2" viewBox="0 0 6 2" className="traffic-light-icon" aria-hidden>
              <path
                d="M0.5 1h5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="traffic-light traffic-light-maximize"
          aria-label={
            maximized
              ? translate('auto.App.66f0a552e5', 'Restore')
              : translate('auto.App.c9d6f98459', 'Maximize')
          }
          onClick={() => window.api.ui.maximize()}
          title={
            maximized
              ? translate('auto.App.66f0a552e5', 'Restore')
              : translate('auto.App.c9d6f98459', 'Maximize')
          }
        >
          {hovered && (
            <svg width="6" height="6" viewBox="0 0 6 6" className="traffic-light-icon" aria-hidden>
              <path
                d="M1 2.5L2.5 1M5 3.5L3.5 5M1 1h2v2M5 5H3V3"
                stroke="currentColor"
                strokeWidth="0.8"
                fill="none"
              />
            </svg>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="window-controls">
      <button
        className="window-controls-btn"
        aria-label={translate('auto.App.bbb7f90669', 'Minimize')}
        onClick={() => window.api.ui.minimize()}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M0 5h10v1H0z" fill="currentColor" />
        </svg>
      </button>
      <button
        className="window-controls-btn"
        aria-label={
          maximized
            ? translate('auto.App.66f0a552e5', 'Restore')
            : translate('auto.App.c9d6f98459', 'Maximize')
        }
        onClick={() => window.api.ui.maximize()}
      >
        {maximized ? (
          // Restore icon (two overlapping squares)
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M2 0v2H0v8h8V8h2V0H2zm6 9H1V3h7v6zM9 7H8V2H3V1h6v6z" fill="currentColor" />
          </svg>
        ) : (
          // Maximize icon (single square outline)
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" fill="currentColor" />
          </svg>
        )}
      </button>
      <button
        className="window-controls-btn window-controls-close"
        aria-label={translate('auto.App.e960d18540', 'Close')}
        // Why: route close through main so the 'close' event fires the terminal-running confirmation guard; window.close() is unreliable in sandboxed renderers.
        onClick={() => window.api.ui.requestClose()}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}
