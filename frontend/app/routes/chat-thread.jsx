import { ChatMessages, ChatInput } from "../components/Chat"
import { initialMessages } from "./home";

export default function chatThread(){
    return (
      <main className="chat-container">
        <h1>Chat XXXX</h1>
        <ChatMessages messages={initialMessages}/>
        <ChatInput />
      </main>
    );
}