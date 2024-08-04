import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl text-destructive">Oops!</h1>
        <p>Vous n'etes pas autorisé à accéder à cette page.</p>
      </div>
      <Link to="/" className="underline">
        Retourner à la page d'accueil
      </Link>
    </div>
  );
}

export default Unauthorized