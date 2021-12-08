import React, { useState, useContext } from "react";
import axiosUsers from "../../../core/Axios/axios-user";
import Card from "../../shared/components/UI/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/Util/Validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };
  // Without Custom hook
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (isLoginMode) {
      const postData = JSON.stringify({
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      });
      try {
        const response = await axiosUsers.post("login", postData);
        console.log(response);
        setIsLoading(false);
        auth.login();
      } catch (err) {
        console.log(err.response.data.message);
        setIsLoading(false);
        setError(
          err.response.data.message || "Something went wrong, Please try again"
        );
      }
    } else {
      const postData = JSON.stringify({
        name: formState.inputs.name.value,
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      });
      try {
        const response = await axiosUsers.post("signup", postData);
        console.log(response);
        // const responseData = response.json();
        // if (!response.status !== 201) {
        //   throw new Error(response.message);
        // }
        // console.log(responseData);
        setIsLoading(false);
        auth.login();
      } catch (err) {
        console.log(err.response.data.message);
        setIsLoading(false);
        setError(
          err.response.data.message || "Something went wrong, Please try again"
        );
      }
    }

    // console.log(formState.inputs);
    // auth.login();
  };
  const clearErrorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;

// const authSubmitHandler = async (event) => {
//   event.preventDefault();

//   if (isLoginMode) {
//     const postData = JSON.stringify({
//       email: formState.inputs.email.value,
//       password: formState.inputs.password.value,
//     });
//     try {
//       const response = await sendRequest("login", "POST", postData);
//       console.log(response);
//       auth.login();
//     } catch (err) {
//       console.log(err);
//     }
//   } else {
//     const postData = JSON.stringify({
//       name: formState.inputs.name.value,
//       email: formState.inputs.email.value,
//       password: formState.inputs.password.value,
//     });
//     try {
//       const response = await axiosUsers.post("signup", "POST", postData);
//       console.log(response);

//       auth.login();
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // console.log(formState.inputs);
//   // auth.login();
// };
