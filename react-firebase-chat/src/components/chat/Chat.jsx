import { useState, useRef, useEffect } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react";
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";



const Chat = () => {
const [chat, setChats] = useState();
const [open, setopen] = useState(false)
const [text, setText] = useState("")
const [img, setImg] = useState({
    file: null,
    url: "",
});

const {chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore();
const { currentUser } = useUserStore();

const endRef = useRef(null)

useEffect(() =>{
    endRef.current?.scrollIntoView({behavior:"smooth"})
})


useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
        setChats(res.data())
    })

    return () => {
        unsub();
    }
},[chatId])


const handleEmoji = e => {
    setText((prev)=> prev + e.emoji)
    setopen(false)
}

 const handleImg = e =>{
        if(e.target.files[0]){
        setImg({
        file:e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
        })
    }
    }



const handleSend = async() =>{
    if (text == "") return;

    let imgUrl = null;

    try{
        if (img.file) {
            imgUrl = await upload(img.file)
        }
    


    
        await updateDoc(doc(db, "chats", chatId), {
            messages: arrayUnion({
                senderId: currentUser.id,
                text,
                createAt: new Date(),
                ...(imgUrl && { img: imgUrl })
            })
        })

        const userIDs = [currentUser.id, user.id]

        userIDs.forEach(async (id)=>{
        const userChatsRef = doc(db, "userchats", id)
        const userChatsSnapshot = await getDoc(userChatsRef)

        if (userChatsSnapshot.exists()){
            const userChatsData = userChatsSnapshot.data()
        
            const chatIndex = userChatsData.chats.findIndex((c)=> c.chatId === chatId)   
       

        userChatsData.chats[chatIndex].lastMessage = text;
        userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false ;
        userChatsData.chats[chatIndex].updatedAt = Date.now();
        
        await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
        })

        }
    })
    } catch (err){
        console.log(err)
    }

    setImg({
        file: null,
        url: "",
    })

    setText("")

}


    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt=""></img>
                    <div className="user"></div>
                    <span>{user?.username}</span>
                    <p>user description</p>
                </div>
                <div className="icons">
                    <img src="./phone.png"></img>
                    <img src="./video.png"></img>
                    <img src="./info.png"></img>
                </div>
            </div>
             <div className="center">
               {chat?.messages?.map((message) => (
            <div className={message.senderId === currentUser.id ? "message own" : "message" } key={message?.createAt}>
                <img src="./avatar.png"></img>
                <div className="texts">
                    {message.img &&
                    <img src={message.img} alt=""></img>}
                    <p>
                        {message.text}
                    </p>
                    {/* <span>{message.createAt}</span> */}
                </div>
            </div>
            
            ))}
            {img.url && (
            <div className="message own">
                <div className="texts">
                    <img src={img.url} alt=""></img>
                </div>
            </div>)}

            <div ref={endRef}></div>
        </div>

            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                    <img src="./img.png" alt=""></img>
                    </label>
                    <input type="file" id="file" style={{display: "none"}} onChange={handleImg}></input>
                    <img src="./camera.png" alt=""></img>
                    <img src="./mic.png" alt=""></img>
                </div>
                    <input type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You can't send a message!": "Type a Message here"} value={text} onChange={e=>setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked}></input>
                    <div className="emoji">
                        <img src="./emoji.png" alt="" onClick={() =>setopen((prev) => !prev)}></img>
                        <div className="picker">

                     
                        <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                        </div>
                    </div>
                    <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>

            </div>
        </div>
    )
}


export default Chat