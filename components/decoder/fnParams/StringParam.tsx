import React from "react";
import { InputField } from "@/components/InputField";

interface Params {
  value: any;
}

export const StringParam = ({ value }: Params) => {
  return (
    <InputField value={value} placeholder="" isReadOnly onChange={() => {}} />
  );
};
