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

    const cancelNamePreset = () => {
        setNamePreset(false)
    }

    const NamePreset = () => {
        return (
            <div className="screen-blur center">
                <div className="popup-wrapper center">
                    <div className="flex-child title">
                        Preset Name:
                    </div>
                    <div className="flex-child">
                        <input className="edit-input" maxLength={21} onChange={HandleUserInput} type="text"></input>
                        <div className="buttons-wrapper">
                            <button className="button" onClick={savePresetName} defaultValue="Preset Name">Save</button>
                            <button className="button" onClick={cancelNamePreset}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        namePreset ? NamePreset() : ''
    )
}