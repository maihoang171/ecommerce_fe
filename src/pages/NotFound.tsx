export const NotFound = () => {
  return (
    <div className="flex flex-col gap 3 mt-5">
      <h1 className="font-bold text-2xl">Page not found</h1>
      <hr className="text-gray-300 my-4" />
      <div className="font-light">
        <p>Our apologies. There has been an error</p>
        <p>The page you are looking for cannot be found.</p>
        <p>
          Please make sure the URL is correct or surf over to our other pages.
        </p>
      </div>
    </div>
  );
};
