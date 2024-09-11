import { useEffect, useState } from "react";
import {
  CardContent,
  Card,
  Icon,
  Button,
  Container,
  FormField,
  Form,
  Input,
  Message,
  MessageHeader,
  Divider,
} from "semantic-ui-react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState();
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (username && currentMessage) {
      const info = {
        message: currentMessage,
        room,
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", info);
      setMessageList((list) => [...list, info]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const messageHandle = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", messageHandle);
    return () => socket.off("receive_message", messageHandle);
  }, [socket]);
  return (
    <Container>
      <Card fluid>
        <CardContent header={`Chat en vivo | Sala: ${room}`} />
        <ScrollToBottom>
          <CardContent style={{ height: "300px", padding: "5px" }}>
            {messageList.map((item, i) => {
              return (
                <>
                  <span key={i}>
                    <Message
                      style={{
                        textAlign: username === item.author ? "right" : "left",
                      }}
                      success={username === item.author}
                      info={username !== item.author}
                    >
                      <MessageHeader>{item.message}</MessageHeader>
                      <p>
                        Enviado por: <strong>{item.author}</strong>, a las{" "}
                        <i>{item.time}</i>hs.
                      </p>
                    </Message>
                    <Divider />
                  </span>
                </>
              );
            })}
          </CardContent>
        </ScrollToBottom>
        <CardContent extra>
          <Form>
            <FormField>
              <div className="ui action input">
                <input
                  value={currentMessage}
                  type="text"
                  placeholder="Escribe un mensaje..."
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  className="ui teal icon right labeled button"
                >
                  <Icon name="send" />
                  Enviar
                </button>
              </div>
            </FormField>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Chat;
