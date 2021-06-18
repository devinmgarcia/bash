import { useHistory } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {

    const history = useHistory()

    const Logout = () => {
        localStorage.removeItem("bash_user")
        history.push("/login")
    }

    return (
        <div className="navbar">
            <div className="logo">BASH</div>
            <div className="right-container">
            <div onClick={Logout} className="logout right-side-item">Logout</div>
            </div>
        </div>
    )
}