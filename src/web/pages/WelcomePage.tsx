import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import User from ":shared/User";
import uuid from "uuid/v4";
import LocalStorageUtils from ":web/LocalStorageUtils";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typeography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  marginTop: {
    marginTop: unit
  },
  button: {
    marginTop: unit,
    marginLeft: "auto",
    marginRight: "auto",
    display: "block"
  }
}));

const JOIN_MUTATION = gql`
mutation JoinSession($user: UserInput!){
  join(user: $user) {
    success
  }
}
`;

export default function WelcomePage({ navigate }: WelcomePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [name, setName] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [joinSession] = useMutation(JOIN_MUTATION);

  useEffect(() => {
    let user = LocalStorageUtils.getItem<User>("user");

    if (user) {
      setName(user.name);
    } else {
      user = {
        id: uuid(),
        name: ""
      };

      LocalStorageUtils.setItem("user", user);
    }

    setUserId(user.id);
  }, []);

  const handleJoin = () => {
    LocalStorageUtils.setItem<User>("user", {
      id: userId!,
      name: name!
    });

    (async () => {
      await joinSession({
        variables: {
          user: {
            id: userId,
            name: name
          }
        }
      });

      navigate?.("/waiting");
    })();
  };

  return <>
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typeography variant="h6">Planning poker</Typeography>
      </Toolbar>
    </AppBar>
    <Container maxWidth="sm" {...css(styles.marginTop)}>
      <TextField label="Name" required fullWidth value={name ?? ''} onChange={(ev) => setName(ev.target.value)} />
      <Button {...css(styles.button)} variant="contained" color="primary" disabled={!name || !userId} onClick={handleJoin}>Join</Button>
    </Container>
  </>;
}