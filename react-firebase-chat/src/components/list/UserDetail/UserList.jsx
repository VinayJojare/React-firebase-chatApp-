
import "./userdetail.css"
import { useUserStore } from "../../../lib/userStore"



const Userdetail = () => {
    const {currentUser} = useUserStore()
    return (
        <div className="Userdetail">
            <div className="user">
                <img src={currentUser.avatar || "./avatar.png"} alt=""></img>
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <img src="./nore.png" alt=""></img>
                <img src="./video.png" alt=""></img>
                <img src="./edit.png" alt=""></img>
            </div>
        </div>
    )
}

export default Userdetail