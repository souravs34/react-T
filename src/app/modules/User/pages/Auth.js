import React, { useState, useContext } from "react";
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
import { useHttpClient } from "../../../modules/shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
          image: undefined,
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
            image: {
              value: null,
              isValid: false,
            },
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };
  // With Custom hook

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLoginMode) {
      try {
        const postData = JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        });
        const responseData = await sendRequest("users/login", "POST", postData);

        auth.login(responseData.data.userId, responseData.data.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        // const postData = JSON.stringify({
        //   name: formState.inputs.name.value,
        //   email: formState.inputs.email.value,
        //   password: formState.inputs.password.value,
        // });

        const responseData = await sendRequest(
          "users/signup",
          "POST",
          formData
        );

        auth.login(responseData.data.userId, responseData.data.token);
      } catch (err) {}
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
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
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please Upload an Image"
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
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
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
