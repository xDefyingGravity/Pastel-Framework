declare global {
  interface Window {
    /**
     * Pastel no performance warnings
     */
    PASTEL_NO_PERFORMANCE_WARN?: boolean
    PASTEL_NO_ROUTE_HALT_WARN?: boolean
    PASTEL_NO_ROUTE_HALT?: boolean
  }
}

export {}
