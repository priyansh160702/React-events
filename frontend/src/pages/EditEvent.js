import { useRouteLoaderData } from "react-router-dom";
import EventForm from "../components/EventForm";

const EditEventPage = () => {
  const data = useRouteLoaderData("event-detail"); //296
  const event = data.event;

  return <EventForm event={event} method="patch" />; //patch method is used for editing.
};

export default EditEventPage;
