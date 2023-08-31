import {
  json,
  redirect,
  useRouteLoaderData,
  defer,
  Await,
} from "react-router-dom"; //296
import { Fragment, Suspense } from "react";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

const EventDetailPage = () => {
  const { event, events } = useRouteLoaderData("event-detail"); //296

  return (
    <Fragment>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>

      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </Fragment>
  );
};

export default EventDetailPage;

export const loadEvent = async (id) => {
  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch details for selected events." },
      { status: 500 }
    );
  } else {
    const resData = await response.json();

    return resData.event;
  }
};

export const loadEvents = async () => {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // return { isError: true, message: "Could not fetch events :(" };
    // throw new Response(JSON.stringify({ message: "Could not fetch events" }), {
    //   status: 500,
    // }); //When an error is thrown,the React router would render the closest errorElement.
    throw json({ message: "Could not fetch events" }, { status: 500 });
  } else {
    const resData = await response.json();

    return resData.events;
  }
};

export const loader = async ({ request, params }) => {
  const id = params.eventId; //useParams was not used since hooks cannot be used in Loader function.

  return defer({
    event: await loadEvent(id), //305
    events: loadEvents(),
  });
};

export const action = async ({ params, request }) => {
  const eventId = params.eventId;

  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: request.method, //The method defined in the EventItem.js
  });

  if (!response.ok) {
    throw json({ message: "Could not delete the event." }, { status: 500 });
  }

  return redirect("/events");
};
