import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore";
import "./detail.css"

const Detail = () => {

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock }= useChatStore();

    const { currentUser } = useUserStore();

    const handleBlock= async()=>{
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id)

        try{

            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });

            changeBlock()

        }catch(err){
            console.log(err)
        }

    }

    return (
        <div className='detail'>
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt=""></img>
                <h2>{user?.username}</h2>
                <p>user details</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat settings</span>
                        <img src="./arrowDown.png" alt=""></img>
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Chat settings</span>
                        <img src="./arrowUp.png" alt=""></img>
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt=""></img>
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt=""></img>
                    </div>
                </div>
                <div className="photos">
                    


                    <div className="photoItem">
                        <div className="photoDetail">

                   <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"></img>
                        <span>Photo_abc_554.png</span>
                        </div>
                    <img src="./download.png" alt="" className="icon"></img>
                    </div>

                    <div className="photoItem">
                        <div className="photoDetail">

                   <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"></img>
                        <span>Photo_abc_554.png</span>
                        </div>
                    <img src="./download.png" alt="" className="icon"></img>
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowDown.png" alt=""></img>
                    </div>
                </div>
                <button onClick={handleBlock}>
                    {isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User Blocked" : "Block User!"}
                </button>
                <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
            </div>
        </div>
    )
}


export default Detail