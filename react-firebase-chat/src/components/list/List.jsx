import ChatList from "./ChatLIst/ChatList"
import UserDetail from "./UserDetail/UserList"
import "./list.css"

const List = () => {
    return (
        <div className='list'>
            <UserDetail/>

            <ChatList/>
        </div>
    )
}


export default List