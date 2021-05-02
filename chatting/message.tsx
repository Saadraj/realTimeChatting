import {
    createStyles,
    makeStyles,
    Paper,
    Theme,
    Typography,
} from "@material-ui/core";
import React, { memo, useEffect, useState } from "react";
import { auth, fireStore } from "../Firebase";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
        },
    })
);

const Message = ({ conversationName }) => {
    const classes = useStyles();

    const [state, setState] = useState([]);
    useEffect(() => {
        fireStore
            .collection(conversationName.message)
            .orderBy("createdAt", "desc")
            .limit(20)
            .onSnapshot((res) => {
                const data = [];
                res.docs.forEach((value) => {
                    data.push({ ...value.data(), id: value.id });
                });
                setState(data);
            });
    }, [conversationName]);

    return (
        <div>
            {state.reverse().map((msg) => (
                <div
                    key={msg.id}
                    className={classes.paper}
                    style={{
                        textAlign:
                            auth.currentUser.uid === msg.uid ? "right" : "left",
                    }}
                >
                    <Paper
                        elevation={0}
                        component="span"
                        style={{
                            backgroundColor:
                                auth.currentUser.uid === msg.uid
                                    ? "#00B2FF"
                                    : "grey",
                            color: "#f7f7f7",
                            borderRadius:
                                auth.currentUser.uid === msg.uid
                                    ? "10px 10px 0px 10px"
                                    : "10px 10px 10px 0px",
                            padding: "10px",
                        }}
                    >
                        <Typography component="span" paragraph>
                            {msg.message}
                        </Typography>
                    </Paper>
                    <p>
                        {msg?.createdAt?.toDate().toLocaleTimeString("en-US")}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default memo(Message);
