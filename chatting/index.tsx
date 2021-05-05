import {
    Card,
    createStyles,
    FormControl,
    makeStyles,
    TextField,
    Theme,
    Typography,
} from "@material-ui/core";
import firebase from "firebase";
import React, { useEffect, useRef, useState } from "react";
import { auth, fireStore } from "../Firebase";
import Message from "./message";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            bottom: 0,
            width: "100%",
            height: "20px",
        },
        title: {
            top: 0,
            width: "100%",
            height: "20px",
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(7),
        },
        message: {
            height: "80vh",
            overflowY: "auto",
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
        },
    })
);

const index = ({ conversationName }) => {
    const classes = useStyles();
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        scrollRef.current.scrollIntoView({
            behavior: "smooth",
        });
        inputRef.current.focus()
    }, [conversationName]);

    const submitSignUp = (e) => {
        e.preventDefault();
        scrollRef.current.scrollIntoView({
            behavior: "smooth",
        });
        if (message !== "") {
            fireStore
                .collection(conversationName.message)
                .add({
                    message,
                    uid: auth.currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                    setMessage("");
                    fireStore
                .collection("users")
                .doc(conversationName.id)
                .update({
                    unread: firebase.firestore.FieldValue.arrayUnion(
                        auth.currentUser.uid
                    ),
                });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    return (
        <div style={{ height: "100vh", borderRight: "1px solid grey",paddingBottom:'1rem' }}>
            <Card className={classes.title}>
                <Typography variant="h4" paragraph>
                    {conversationName.name}
                </Typography>
            </Card>
            <div className={classes.message}>
                {conversationName.message && (
                    <Message conversationName={conversationName} />
                )}
                <div ref={scrollRef}></div>
            </div>
            <div className={classes.form}>
                <form onSubmit={submitSignUp} autoComplete="off">
                    <FormControl fullWidth margin="normal">
                        <TextField
                            name="message"
                            label="message"
                            placeholder="message"
                            variant="outlined"
                            value={message}
                            ref={inputRef}
                            autoFocus
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </FormControl>
                </form>
            </div>
        </div>
    );
};
export default index;
