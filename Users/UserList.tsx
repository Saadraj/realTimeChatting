import {
    Divider,
    Grid,
    IconButton,
    Tooltip,
    Typography
} from "@material-ui/core";
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useEffect, useState } from "react";
import firebase, { auth, fireStore } from "../Firebase";

const UserList = ({ setConversationName }) => {
    const [state, setState] = useState([]);
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        fireStore
            .collection("users")
            .orderBy("createdAt", "desc")
            .onSnapshot((res) => {
                const data = [];
                res.docs.forEach((value) => {
                    data.push({ ...value.data(), id: value.id });
                });
                setState(data);
            });
        fireStore
            .collection("users")
            .doc(auth.currentUser.uid)
            .onSnapshot((res) => {
                const data = [];
                data.push({ ...res.data(), id: res.id });
                setFriends(data[0].friends);
            });
    }, []);

    const addFriend = async (id) => {
        const FieldValue = firebase.firestore.FieldValue;
        if (friends?.includes(id)) {
            fireStore
                .collection("users")
                .doc(auth.currentUser.uid)
                .update({
                    friends: FieldValue.arrayRemove(id),
                });
            fireStore
                .collection("users")
                .doc(id)
                .update({
                    friends: FieldValue.arrayRemove(auth.currentUser.uid),
                });
        } else {
            const message = auth.currentUser.uid + id;
            fireStore
                .collection("users")
                .doc(auth.currentUser.uid)
                .update({
                    friends: FieldValue.arrayUnion(id),
                    conversation: FieldValue.arrayUnion({ id, message }),
                });
            fireStore
                .collection("users")
                .doc(id)
                .update({
                    conversation: FieldValue.arrayUnion({
                        id: auth.currentUser.uid,
                        message,
                    }),
                    friends: FieldValue.arrayUnion({
                        id: auth.currentUser.uid,
                    }),
                });
        }
    };

    const setConversation = (messageList, name) => {
        try {
            const message = messageList.filter((v) =>
                v.id === auth.currentUser.uid ? v.message : ""
            );
            setConversationName({ message: message[0].message, name });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <>
            <div
                style={{
                    borderRight: "1px solid grey",
                    height: "50vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h4" align="center" paragraph>
                    Friends
                </Typography>
                <Divider />
                {state.map((v) =>
                    v.email !== auth?.currentUser?.email &&
                    friends?.includes(v.id) ? (
                        <Grid
                            container
                            key={v.id}
                            justify="space-between"
                            alignItems="center"
                            style={{
                                padding: "0 1rem",
                                cursor: "pointer",
                                borderBottom: "1px solid grey",
                            }}
                            onClick={() =>
                                setConversation(v.conversation, v.name)
                            }
                        >
                            <Grid item>
                                <Typography variant="h4">{v.name}</Typography>
                                <Typography paragraph>{v.email}</Typography>
                            </Grid>
                            <Grid item>
                                <IconButton
                                    color="primary"
                                    onClick={() => addFriend(v.id)}
                                >
                                    {friends?.includes(v.id) ? (
                                        <Tooltip title="Click to remove from Friend List">
                                            <LibraryAddCheckIcon />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Click to add in Friend List">
                                            <PersonAddIcon />
                                        </Tooltip>
                                    )}
                                </IconButton>
                            </Grid>
                        </Grid>
                    ) : null
                )}
            </div>
            <div
                style={{
                    borderRight: "1px solid grey",
                    height: "50vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h4" align="center" paragraph>
                    Recomanded
                </Typography>
                <Divider />
                {state.map((v) =>
                    v.email !== auth?.currentUser?.email &&
                    !friends?.includes(v.id) ? (
                        <Grid
                            container
                            key={v.id}
                            justify="space-between"
                            alignItems="center"
                            style={{
                                padding: "0 1rem",
                                cursor: "pointer",
                                borderBottom: "1px solid grey",
                            }}
                            onClick={() =>
                                setConversation(v.conversation, v.name)
                            }
                        >
                            <Grid item>
                                <Typography variant="h4">{v.name}</Typography>
                                <Typography paragraph>{v.email}</Typography>
                            </Grid>
                            <Grid item>
                                <IconButton
                                    color="primary"
                                    onClick={() => addFriend(v.id)}
                                >
                                    {friends?.includes(v.id) ? (
                                        <Tooltip title="Click to remove from Friend List">
                                            <LibraryAddCheckIcon />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Click to add in Friend List">
                                            <PersonAddIcon />
                                        </Tooltip>
                                    )}
                                </IconButton>
                            </Grid>
                        </Grid>
                    ) : null
                )}
            </div>
        </>
    );
};

export default UserList;
