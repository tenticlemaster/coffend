export default function Layout(props) {
    const { children } = props

    const header = (
      <header>
        <div>
            <h1 className="text-gradient">CAFFIEND</h1>
            <p>For Coffee Insatiets</p>
        </div>
        <button>
            <p>Sign up for free</p>
            <i className="fa-solid fa-mug-saucer"></i>
        </button>
      </header>
    )

    const footer = (
        <footer>
            <p><span className="text-gradient">Caffiend</span> was made by <a target="_blank" href="https://github.com/tenticlemaster">Amir</a><br />using the <a href="https://github.com/jamezmca/fantacss">FantaCSS</a> design library.</p>
        </footer>
    )
 
    return (
        <>
            {header}
            <main>
                {children}
            </main>
            {footer}
        </>
    )
}

