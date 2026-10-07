import { ChatMessages, ChatInput } from "../components/Chat"
import ChatThread from "../components/ChatThread";
import { initialMessages } from "./home";

export default function chatThread(){
    return (
      <section className="chat-container">
        <ChatThread/>
        <ChatMessages messages={initialMessages}/>
        <ChatInput />
      </section>
    );
}