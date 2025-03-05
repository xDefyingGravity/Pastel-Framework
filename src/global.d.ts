declare global {
  interface Window {
    /**
     * Pastel no performance warnings
     */
    PASTEL_NO_PERFORMANCE_WARN?: boolean
    PASTEL_NO_PIPELINE_WARN?: boolean
    PASTEL_NO_ROUTE_HALT?: boolean
    PASTEL_NO_ROUTE_HALT_WARN?: boolean
    pastel: {
      pipelines?: Pipeline[]
    }
  }
}

export {}
