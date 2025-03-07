import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(props) {
    const { children } = props

    const [globalUser, setglobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        setUser(null)
        setGlobalData(null)
        return signOut
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    const value = { globalUser, globalData, setGlobalData, isLoading, signup, login, logout}

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('CURRENT USER: ', user)
            
            // if there is no user, empty the usser state and return from this listner
            if (!user) { 
                console.log('no active user')
                return 
            }

            // if there is a user, then check if the user has data in the database, and if they do fetch said data and update the global state
            try {
                setIsLoading(true)

                // first we create a refernce for the dcument (labeled json object), and then we get the doc, and then we snapshot it to see if there is anything there.
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = {}
                if (docSnap.exists()) {
                    console.log('found user data')
                    firebaseData = docSnap.data()
                }
                setGlobalData(firebaseData)
            } catch (error) {
                console.log(error.message)
            } finally {
                setIsLoading(false)
            }
        })
        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}