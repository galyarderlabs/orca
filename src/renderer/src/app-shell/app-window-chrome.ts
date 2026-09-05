import {
  isPairedWebClientWindow,
  shouldRenderDesktopWindowChrome
} from '@/lib/desktop-window-chrome'

export const isMac = navigator.userAgent.includes('Mac')
export const isWindows = !isMac && navigator.userAgent.includes('Windows')
export const isLinux = !isMac && !isWindows
export const shortcutPlatform: NodeJS.Platform = isMac ? 'darwin' : isWindows ? 'win32' : 'linux'
// Why: Windows and Linux remove the native title bar so the renderer draws its own chrome; paired web clients run in a browser tab and must not.
export const hasCustomTitleBar = shouldRenderDesktopWindowChrome({
  platform: shortcutPlatform,
  isWebClient: isPairedWebClientWindow()
})

// Why: Windows renders window controls on the right (138px). On Linux with MacTahoe theme,
// window controls are traffic lights on the LEFT, so the right-side offset is 0px.
export const WINDOW_CONTROLS_WIDTH = (hasCustomTitleBar && isWindows) ? '138px' : '0px'
export const WINDOW_CONTROLS_HEIGHT = hasCustomTitleBar ? '36px' : '0px'

// Why: macOS and Linux with MacTahoe paint traffic lights on the window's top-left edge.
export const MAC_TRAFFIC_LIGHTS_WIDTH = (isMac || (hasCustomTitleBar && isLinux)) ? '80px' : '0px'
