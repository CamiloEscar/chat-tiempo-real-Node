import "./App.css";
import io from "socket.io-client"; //para poder hacer la conexion
import { useState } from "react";
import Chat from "./Chat";
import {
  CardContent,
  Container,
  Divider,
  Card,
  Icon,
  FormField,
  Button,
  Checkbox,
  Form,
} from "semantic-ui-react";

const socket = io.connect("http://localhost:3001"); //creo una conexion al back

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <>
      <Container>
        {!showChat ? (
          <Card fluid>
            <CardContent header="Unirme al chat" />
            <CardContent>
              <Form>
                <FormField>
                  <label>Username: </label>
                  <input
                    type="text"
                    placeholder="Usuario..."
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormField>
                <FormField>
                  <label>Sala: </label>
                  <input
                    type="text"
                    placeholder="ID Sala:"
                    onChange={(e) => setRoom(e.target.value)}
                  />
                </FormField>
                <Button onClick={joinRoom}>Unirme</Button>
              </Form>
            </CardContent>
            <CardContent extra>
              <Icon name="user" />4 Friends
            </CardContent>
          </Card>
        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}
      </Container>
    </>
  );
}

export default App;
