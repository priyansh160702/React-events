import {
  useNavigate,
  Form,
  useNavigation,
  useActionData,
  redirect,
  json,
} from "react-router-dom";
import classes from "./EventForm.module.css";

function EventForm({ method, event }) {
  const data = useActionData(); //useActionData takes any response returned by the action.  //301
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const navigate = useNavigate();
  function cancelHandler() {
    navigate("..");
  }

  return (
    <Form method={method} className={classes.form}>
      {data && data.errors && (
        <ul>
          {Object.values(data.errors).map((err) => (
            <li key={err}>{err}</li> //301
          ))}
        </ul>
      )}
      <p>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          defaultValue={event ? event.title : ""}
        />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="url"
          name="image"
          required
          defaultValue={event ? event.image : ""}
        />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          required
          defaultValue={event ? event.date : ""}
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          required
          defaultValue={event ? event.description : ""}
        />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </div>
    </Form>
  );
}

export default EventForm;

export const action = async ({ request, params }) => {
  const method = request.method;

  //298
  const data = await request.formData();

  const eventData = {
    title: data.get("title"), //title here is the 'name' prop used in the form.
    image: data.get("image"),
    date: data.get("date"),
    description: data.get("description"),
  };

  //302
  let url = "http://localhost:8080/events";

  if (method === "PATCH") {
    const eventId = params.eventId;

    url = "http://localhost:8080/events/" + eventId;
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (response.status === 422) {
    //422 is the validation code set on the backend(Not to worry about).
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not save event" }, { status: 500 });
  }

  return redirect("/events"); //298
};
