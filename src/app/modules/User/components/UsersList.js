import React from "react";

import Card from "../../shared/components/UI/Card";
import UsersItem from "./UserItem";
import "./UsersList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <Card className="center">
        <h2>No Users Found</h2>
      </Card>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user) => {
        return (
          <UsersItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places.length}
          />
        );
      })}
    </ul>
  );
};

export default UsersList;
