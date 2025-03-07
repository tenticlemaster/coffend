import { useState } from "react"
import { useAuth } from "../context/AuthConext"

export default function Authentication(props) {
    const { handleCloseModal } = props

    const [isRegistration, setIsRegistration] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [error, setError] = useState(null)

    const { signup, login, logout } = useAuth()

    async function handleAuthenticate() {
        if (!email || !email.includes('@') || !password || password.length < 6 || isAuthenticating) { return }

        try {
            setIsAuthenticating(true)
            setError(null)

            if (isRegistration) {
                // Regester the user
                await signup(email, password)
            } else {
                // Login user
                await login(email, password)
            }
            handleCloseModal()
        } catch (error) {
            console.log(error.message)
            setError(error.message)
        } finally {
            setIsAuthenticating(false)
        }
    }

    return (
        <>  
            <h2 className="sign-up-text">{isRegistration ? 'Sign Up' : 'Login'}</h2>
            <p>{isRegistration ? 'Create an account!' : 'Sign in to your account!'}</p>
            {error && (
                <p>❌{error}</p>
            )}
            <input value={email} onChange={(event) => {setEmail(event.target.value)}} type="email" placeholder="Email" />
            <input value={password} onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="***********" />
            <button onClick={handleAuthenticate}><p>{isAuthenticating ? 'Authenticating...' : 'Submit'}</p></button>
            <hr />
            <div className="register-content">
                <p>{!isRegistration ? "Don't have an account?" : 'Have an account?'}</p>
                <button onClick={() => {setIsRegistration(!isRegistration)}}><p>{!isRegistration ? 'Sign Up' : 'Login'}</p></button>
            </div>
        </>
    )
}