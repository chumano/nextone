import React from "react";
import { FieldErrors, useFormContext } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

export function addServerErrors<T>(
    errors: { [P in keyof T]?: string[] },
    setError: (
      fieldName: keyof T,
      error: { type: string; message: string }
    ) => void
  ) {
    return Object.keys(errors).forEach((key) => {
      setError(key as keyof T, {
        type: "server",
        message: errors[key as keyof T]!.join(". ")
      });
    });
  }

  
type ErrorSummaryProps<T> = {
    errors: FieldErrors<T>;
};

function ErrorSummary<T>({ errors }: ErrorSummaryProps<T>) {
    if (Object.keys(errors).length === 0) {
      return null;
    }
    return (
      <div className="error-summary">
        {Object.keys(errors).map((fieldName) => (
          <ErrorMessage
            errors={errors}
            name={fieldName as any}
            as="div"
            key={fieldName}
          />
        ))}
      </div>
    );
  }

export default ErrorSummary;