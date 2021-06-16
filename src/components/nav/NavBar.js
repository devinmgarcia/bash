import "./NavBar.css"

export const NavBar = () => {

    const Logout = () => {
        localStorage.removeItem("bash_user")
    }

    return (
        <div className="navbar">
            <div className="logo">Bash</div>
            <div className="right-container">
            <div onClick={Logout} className="logout right-side-item">Logout</div>
            </div>
        </div>
    )
}