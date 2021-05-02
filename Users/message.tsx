import { useEffect, useState } from "react";
import { auth, fireStore } from "../Firebase";

const Message = () => {
    const [state, setState] = useState([]);
    useEffect(() => {
        fireStore
            .collection("message")
            .orderBy("createdAt")
            .onSnapshot((res) => {
                const data = [];
                res.docs.forEach((value) => {
                    data.push({ ...value.data(), id: value.id });
                });
                setState(data);
            });
    }, []);
    return (
        <div>
            {state.map((msg) => (
                <div
                    key={msg.id}
                    style={{
                        textAlign:
                            auth.currentUser.uid === msg.uid ? "right" : "left",
                        margin: "30px 0",
                    }}
                >
                    <span
                        style={{
                            backgroundColor:
                                auth.currentUser.uid === msg.uid
                                    ? "grey"
                                    : "purple",
                            borderRadius:
                                auth.currentUser.uid === msg.uid
                                    ? "10px 10px 0px 10px"
                                    : "10px 10px 10px 0px",
                            padding: "10px",
                        }}
                    >
                        {msg.message}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Message;
