import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UI/Card";
import Button from "../../shared/components/FormElements/Button";
const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`places/user/${userId}`);

        const propertyValues = Object.values(
          responseData.data.places[0].location
        ); // Convert Object to array

        responseData.data.places[0].location = propertyValues;
        setLoadedPlaces(responseData.data.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);
  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  // const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && !loadedPlaces && (
        <div className="place-list center">
          <Card>
            <h2>No Places Found. Maybe Create one?</h2>
            <Button to="/places/new">Share Place</Button>
          </Card>
        </div>
      )}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlaces={placeDeletedHandler} />
      )}
    </>
  );
};

export default UserPlaces;
