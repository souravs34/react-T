import React, { useEffect, useState } from "react";
import axiosUsers from "../../../core/Axios/axios-user";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
const Users = () => {
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await axiosUsers.get(" ");
        //console.log(response.data);
        setLoadedUsers(response.data.users);
      } catch (err) {
        setError(err.response.data.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);
  const errorHandler = () => {
    setError(null);
  };
  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
