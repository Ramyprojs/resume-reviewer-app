import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function jsonErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Invalid request data.",
        details: error.flatten()
      },
      { status: 400 }
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details
      },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    console.error("Unhandled route error", error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong while processing your request."
      },
      { status: 500 }
    );
  }

  console.error("Unhandled route error", error);

  return NextResponse.json(
    {
      error: "Something went wrong while processing your request."
    },
    { status: 500 }
  );
}
