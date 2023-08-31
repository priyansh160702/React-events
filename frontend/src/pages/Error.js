import { useRouteError } from "react-router-dom";
import PageContent from "../components/PageContent";
import { Fragment } from "react";
import MainNavigation from "../components/MainNavigation";

const ErrorPage = () => {
  const error = useRouteError();

  let title = "An error occurred :(";
  let message = "Something went wrong";

  if (error.status === 500) {
    message = error.data.message; //error.data is the data used in the Events.js line 27.
  }

  if (error.status === 404) {
    title = "Not found";
    message = "Could not find page";
  }

  return (
    <Fragment>
      <MainNavigation />
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
    </Fragment>
  );
};

export default ErrorPage;
