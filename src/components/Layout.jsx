import { useState } from "react"
import Authentication from "./Authentication"
import Modal from "./Modal"

export default function Layout(props) {
    const { children } = props

    const [ showModal, setShowModal ] = useState(false)

    const header = (
      <header>
        <div>
            <h1 className="text-gradient">CAFFIEND</h1>
            <p>For Coffee Insatiets</p>
        </div>
        <button onClick={() => { setShowModal(true) }}>
            <p>Sign up for free</p>
            <i className="fa-solid fa-mug-saucer"></i>
        </button>
      </header>
    )

    const footer = (
        <footer>
            <p><span className="text-gradient">Caffiend</span> was made by <a target="_blank" href="https://github.com/tenticlemaster">Amir</a><br />using the <a href="https://github.com/jamezmca/fantacss">FantaCSS</a> design library. <br />Check out the project on <a target="_blank" href="https://github.com/tenticlemaster/coffend">GitHub</a></p>
        </footer>
    )
 
    return (
        <>
            {showModal && (<Modal handleCloseModal={() => {setShowModal(false)}}>
                <Authentication handleCloseModal={() => {setShowModal(false)}}/>
            </Modal>)}
            {header}
            <main>
                {children}
            </main>
            {footer}
        </>
    )
}

