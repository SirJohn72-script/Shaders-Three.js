import { useRef, useEffect } from "react"
import { initScene, cleanUpScene } from "./Script"

const Ola = () => {
  const currentRef = useRef(null)

  useEffect(() => {
    initScene(currentRef)

    return () => {
      cleanUpScene()
    }
  }, [])

  return (
    <div
      ref={currentRef}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  )
}

export default Ola
