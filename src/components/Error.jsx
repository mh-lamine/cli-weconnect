const Error = ({errMsg}) => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-3xl text-destructive">Oops!</h1>
      <p>Une erreur s'est produite.</p>
      <p>{errMsg}</p>
    </div>
  );
};

export default Error;
