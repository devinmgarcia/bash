import { useContext, useState } from "react"
import { PresetContext } from "../presets/PresetProvider"
import "./PopUps.css"

export const PopUps = ({namePreset, setNamePreset, presetObj}) => {
    let [userInput, setUserInput]  = useState('')
    const {editPreset} = useContext(PresetContext)

    const HandleUserInput = (event) => {
        setUserInput(event.target.value)
    }

    const savePresetName = (event) => {
        event.preventDefault()
        if (presetObj.userId !== 0) {
            const newPresetObj = {
                id: presetObj.id,
                name: userInput,
                userEditable: presetObj.userEditable,
                userId: presetObj.userId
            }
            editPreset(newPresetObj)
        }
        setNamePreset(false)
    }

    const NamePreset = () => {
        return (
            <div className="screen-blur center">
                <div className="popup-wrapper center">
                    <input onChange={HandleUserInput} type="text"></input><button onClick={savePresetName} defaultValue="Preset Name">Save</button>
                </div>
            </div>
        )
    }

    return (
        namePreset ? NamePreset() : ''
    )
}