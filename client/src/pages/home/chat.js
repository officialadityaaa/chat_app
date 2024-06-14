import styles from './style.module.css';
import MessagesReceived from './messages';
import SendMessage from './send-message';
const Chat = ({  username, room, socket }) => {
  return (
    <div className={styles.chatContainer}>
      <div>
        <MessagesReceived socket={socket} />
        <div className={styles.contt}>
        <SendMessage socket={socket} username={username} room={room} />
        </div>
       
      </div>
    </div>
  );
};

export default Chat;