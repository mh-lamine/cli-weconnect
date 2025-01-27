import { useState } from "react";
import quotes from "../assets/RandomQuotes.js";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";

export default function RandomQuotes() {
  const [quoteToDisplay, _setQuoteToDisplay] = useState(
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  const { type, text, author } = quoteToDisplay;

  return (
    <div className="text-dark lg:text-white bg-white lg:bg-transparent p-4 lg:p-0 rounded-lg shadow-md lg:shadow-none lg:text-xl flex flex-col w-full gap-4 lg:gap-8">
      <h1 className="hidden lg:block lg:text-4xl font-semibold">
        Ravi de vous revoir !
      </h1>
      <DropdownMenuSeparator className="hidden lg:block bg-white" />
      <h2 className="lg:text-lg text-primary lg:text-white font-medium lg:hidden">{type} du jour</h2>
      <p className="text-base">&quot;{text}&quot;</p>
      <span className="font-medium">{author ? author : "WeConnect"}</span>
    </div>
  );
}
