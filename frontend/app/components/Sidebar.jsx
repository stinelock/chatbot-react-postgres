import { useState } from "react";

function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <h2 className="chatbot-title">Chatbot</h2>
      <a href="/chat/new" className="new-chat-btn">
        + New
      </a>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <a href="/profile" className="user-profile">
        <img
          src="https://ui-avatars.com/api/?name=Batman&background=0D0D0D&color=fff&size=40"
          alt="User avatar"
          className="user-avatar"
          width={30}
          height={30}
        />
        <span className="user-name">Batman</span>
      </a>
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
        <a href={href} className="chat-thread-link">
          {title}
        </a>
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
            href={thread.href}
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
