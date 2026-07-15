import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ChatData = createContext();

const ChatContext = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [activeDocId, setActiveDocId] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (!activeDocId) return;

        const fetchMessages = async () => {
            try {
                setLoadingHistory(true);

                const token = JSON.parse(localStorage.getItem("token"));

                const res = await axios.get(
                    `http://127.0.0.1:8000/documents/${activeDocId}/chat`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setMessages(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchMessages();
    }, [activeDocId]);

    return (
        <ChatData.Provider
            value={{
                messages,
                setMessages,
                activeDocId,
                setActiveDocId,
                loadingHistory,
            }}
        >
            {children}
        </ChatData.Provider>
    );
};

export default ChatContext;