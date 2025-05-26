"use client";
import { useCallback, useEffect, useState } from "react";
import { test } from "../lib/actions";

interface Data {
  status: string;
  message: string;
}

const Test = () => {
  const [data, setData] = useState<Data>();

  const dataFetch = useCallback(async () => {
    const response = await test();
    setData(response);
    console.log(response);
  }, []);

  useEffect(() => {
    (async () => {
      await dataFetch();
    })();
  }, [dataFetch]);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <>
      <div>
        <h1>Message from Backend</h1>
        <p>Status: {data?.status.toString()}</p>
        <p>Message: {data?.message.toString()}</p>
      </div>
    </>
  );
}

export default Test;