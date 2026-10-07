import { useState } from "react";
import { Link, href } from "react-router"

function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <h2 className="chatbot-title">Chatbot</h2>
      <Link to="/chat/new" className="new-chat-btn">
        + New
      </Link>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <Link to="/profile" className="user-profile">
        <img
          src="https://ui-avatars.com/api/?name=Batman&background=0D0D0D&color=fff&size=40"
          alt="User avatar"
          className="user-avatar"
          width={30}
          height={30}
        />
        <span className="user-name">Batman</span>
      </Link>
    </div>
  );
}

function ChatThreadItem({ id, href, title, deleteThread }) {
  function handleDeleteClick(event) {
    event.stopPropagation();

    console.log(id, href, title, deleteThread);

    deleteThread(id);
  }

  return (
    <li className="chat-thread-item">
      <div className="chat-thread-item-content">
        <Link to={href} className="chat-thread-link">
          {title}
        </Link>
        <button aria-label type="button" onClick={handleDeleteClick}>
          X
        </button>
      </div>
    </li>
  );
}

function ChatThreadList({ threads = [], deleteThread }) {
  const [searchValue, setSearchValue] = useState("");

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
  }

  return (
    <nav className="chat-threads-list" aria-label="Chat threads">
      <input onChange={handleSearchChange}></input>
      <ul>
        {filteredThreads.map((thread) => (
          <ChatThreadItem
            key={thread.id}
            href={href("chat/:threadId", {threadId: thread.id})}
            title={thread.title}
            deleteThread={deleteThread}
            id={thread.id}
          />
        ))}
      </ul>
    </nav>
  );
}

export default function Sidebar({ threads = [], deleteThread }) {
  return (
    <aside className="sidebar">
      <SidebarHeader />
      <ChatThreadList threads={threads} deleteThread={deleteThread} />
      <SidebarFooter />
    </aside>
  );
}
