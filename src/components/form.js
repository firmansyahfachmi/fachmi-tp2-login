import { useState, useEffect } from "react";
import logo from "../logo.svg";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Modal } from "react-bootstrap";

function Forms() {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [errorLimit, setErrorLimit] = useState(0);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [cooldown, setCooldown] = useState(false);
  const [timeCooldown, setTimeCooldown] = useState(30);
  const [isIdle, setIsIdle] = useState(false);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = () => {
    if (cooldown) {
      return false;
    } else {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setIsEmailValid(true);
      } else {
        setIsEmailValid(false);
        setErrorLimit(errorLimit + 1);
      }

      if (password.length < 8) {
        setIsPasswordValid(false);
        setErrorLimit(errorLimit + 1);
      }
    }
  };

  useEffect(() => {
    if (timeCooldown <= 29) {
      if (timeCooldown > 0) {
        setTimeout(() => setTimeCooldown(timeCooldown - 1), 1000);
      } else {
        setCooldown(false);
        setErrorLimit(0);
        setTimeCooldown(30);
      }
    }
  }, [timeCooldown]);

  useEffect(() => {
    if (errorLimit === 3) {
      setCooldown(true);
      setTimeCooldown(timeCooldown - 1);
    }
  }, [errorLimit]);

  useEffect(() => {
    let timeoutId;

    const handleUserActivity = () => {
      clearTimeout(timeoutId);
    //   setIsIdle(false);
      timeoutId = setTimeout(() => setIsIdle(true), 30000);
    };

    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keypress", handleUserActivity);
    document.addEventListener("touchstart", handleUserActivity);

    timeoutId = setTimeout(() => setIsIdle(true), 30000);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keypress", handleUserActivity);
      document.removeEventListener("touchstart", handleUserActivity);
    };
  }, []);

  return (
    <div className="form">
      <h2>Login</h2>
      <br />
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={handleChangeEmail}
            value={email}
          />
          {!isEmailValid && (
            <Form.Text className="error-msg">Email Not Valid</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={handleChangePassword}
            value={password}
          />
          {!isPasswordValid && (
            <Form.Text className="error-msg">
              Password must be 8 character more
            </Form.Text>
          )}
        </Form.Group>
        <div className="button-box">
          <Button
            variant={cooldown ? "disabled" : "primary"}
            onClick={handleSubmit}
            disabled={cooldown ? true : false}
          >
            Submit
          </Button>
          {cooldown && <h6>0:{timeCooldown.toString().padStart(2, "0")}</h6>}
        </div>
      </Form>

      <Modal
        size="sm"
        show={isIdle}
        onHide={() => setIsIdle(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            User is idle
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="logo-wrap">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() =>  setIsIdle(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Forms;
