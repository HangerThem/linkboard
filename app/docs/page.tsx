"use client"

import dynamic from "next/dynamic"
import "swagger-ui-react/swagger-ui.css"

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false })

export default function ApiDocsPage() {
  return (
    <div className="swagger-wrapper">
      <SwaggerUI url="/api/docs" />
      <style jsx global>{`
        .swagger-wrapper {
          background: #fff;
          min-height: 100vh;
        }
        .swagger-ui .topbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
