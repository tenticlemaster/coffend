import { useState } from "react"
import { coffeeOptions } from "../utils"
import Authentication from "./Authentication"
import Modal from "./Modal"
import { useAuth } from "../context/AuthConext"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../../firebase"


export default function CoffeeForm(props) {
    const { isAuthenticated } = props

    const { globalData, setGlobalData, globalUser } = useAuth()
    
    const [showModal, setShowModal] = useState(false)
    const [coffeeSelection, setCoffeeSelection] = useState(null)
    const [showCoffeeTypes, setshowCoffeeTypes] = useState(false)
    const [coffeeCost, setCoffeeCost] = useState(0)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)

    async function handleSubmit() {
        if (!isAuthenticated) {
            setShowModal(true)
            return
        }

        try {
            // define guard lause that only return the form if it is comleted
            if (!coffeeSelection) { return }

            // then we're going to create a new object
            const newGlobalData = {
                ...(globalData || {})
            }

            const nowTime = Date.now()
            const timeToSubtract = (hour * 60 * 60 * 1000) + (minute * 60 * 1000)
            const timestamp = nowTime - timeToSubtract

            const newData = {
                name: coffeeSelection,
                cost: coffeeCost
            }
            newGlobalData[timestamp] = newData

            console.log(timestamp, coffeeSelection, coffeeCost)
            
            // update the global state
            setGlobalData(newGlobalData)

            // persist the data in the firebase firestore
            const userRef = doc(db, 'users', globalUser.uid)
            const res = await setDoc(userRef, {
                [timestamp] : newData
            }, { merge: true })

            setCoffeeSelection(null)
            setCoffeeCost(0)
            setHour(0)
            setMinute(0)
        } catch (err) {
            console.log(err.message)
        } finally {

        }

        
    }


    return (
        <>  
            {showModal && (<Modal handleCloseModal={() => {setShowModal(false)}}>
                <Authentication handleCloseModal={() => {setShowModal(false)}} />
            </Modal>)}
            <div className="section-header">
                <i className="fa-solid fa-pencil" />
                <h2>Start Traking Today</h2>
            </div>
            <h4>Select coffee type</h4>
            <div className="coffee-grid">
                {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
                    return (
                        <button onClick={ () => {
                            setshowCoffeeTypes(false)
                            setCoffeeSelection(option.name)
                        } } key={optionIndex} className={"button-card " + (option.name === coffeeSelection && "coffee-button-selected")}>
                            <h4>{option.name}</h4>
                            <p>{option.caffeine}mg</p>
                        </button>
                    )
                })}
                <button onClick={ () => {
                    setshowCoffeeTypes(true)
                    setCoffeeSelection(null)
                }} className={"button-card " + (showCoffeeTypes && "coffee-button-selected")}>
                    <h4>Other</h4>
                    <p>n/a</p>
                </button>
            </div>
            {showCoffeeTypes && (
                <select onChange={(e) => {
                    setCoffeeSelection(e.target.value)
                }} name="coffee-list" id="coffee-list">
                    <option value={null}>Select type</option>
                    {coffeeOptions.map((option, optionIndex) => {
                        return (
                            <option value={option.name} key={optionIndex}>
                                {option.name} ({option.caffeine}mg)
                            </option>
                        )
                    })}
                </select>
            )}
            <h4>Add the cost ($)</h4>
            <input value={coffeeCost} onChange={(e) => {
                (e.target.value < 0) && (e.target.value = null)
                setCoffeeCost(e.target.value)
            }} className="w-full" type="number" min='0' placeholder="4.50" />
            <h4>Time since consumption</h4>
            <div className="time-entry">
                <div>
                    <h6>Hours</h6>
                    <select onChange={(e) => {
                        setHour(e.target.value)
                    }} id="hours-select">
                        {[...Array(24).keys()].map((hour, hoursIndex) => {
                            return (
                                <option key={hoursIndex} value={hour}>{hour}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <h6>Minutes</h6>
                    <select onChange={(e) => {
                        setMinute(e.target.value)
                    }} id="minutes-select">
                        {[...Array(60).keys()].map((value, index) => {
                            return (
                                <option key={index} value={value}>{value}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <button onClick={handleSubmit}>
                <p>Add entry</p>
            </button>
        </>
    )
}