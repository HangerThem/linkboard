"use client"

import { useEffect, useState } from "react"
import * as Icons from "react-bootstrap-icons"

export default function TestPage() {
  const [search, setSearch] = useState("")

  return (
    <>
      <input onChange={(e) => setSearch(e.target.value)} />
      <button
        onClick={async () => {
          const response = await fetch("/api/link", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([
              {
                title: "Test Link",
                url: "https://example.com",
                icon: "Github",
              },
            ]),
          })
          if (response.ok) {
            console.log("Data saved successfully")
          } else {
            console.error("Failed to save data")
          }
        }}
      >
        Save Data
      </button>
      {/* <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {Object.entries(Icons)
          .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
          .map(([key, Value]) => (
            <div
              key={key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100px",
              }}
            >
              <Value size={32} />
              <span style={{ marginTop: "10px", textAlign: "center" }}>
                {key}
              </span>
            </div>
          ))}
      </div> */}
    </>
  )
}
