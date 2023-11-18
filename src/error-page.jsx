import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oopsy Doopsy!</h1>
      <p>Sorry, an unexpected error has occurred. That item was never seen.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
