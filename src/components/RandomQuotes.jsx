import { useState } from "react";
import quotes from "../assets/RandomQuotes.js";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";

export default function RandomQuotes() {
  const [quoteToDisplay, _setQuoteToDisplay] = useState(
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  const { type, text, author } = quoteToDisplay;

  return (
    <div className="text-white text-xl flex flex-col w-full gap-4 lg:gap-8">
      <h1 className="hidden lg:block text-4xl font-semibold">Ravi de vous revoir !</h1>
      <DropdownMenuSeparator className="hidden lg:block bg-white" />
      <h2 className="text-lg font-medium lg:hidden">{type} du jour</h2>
      <p className="text-base">&quot;{text}&quot;</p>
      <span className="font-medium">{author ? author : "WeConnect"}</span>
    </div>
  );
}
