"use client";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export const SearchInput = () => {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];
  return (
    <PlaceholdersAndVanishInput
      placeholders={placeholders}
      onChange={() => {}}
      onSubmit={() => {}}
    />
  );
};
