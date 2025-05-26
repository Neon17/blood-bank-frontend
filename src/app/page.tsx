"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { test } from "./lib/actions";

interface Data {
  status: string;
  message: string;
}

export default function Home() {
  const [data, setData] = useState<Data>();

  const dataFetch = useCallback(async () => {
    const response = await test();
    setData(response);
    console.log(response);

  }, []);

  useEffect(() => {
    // Define and immediately invoke async function
    (async () => {
      await dataFetch();
    })();
  }, [dataFetch]);

  useEffect(() => {
    if (data) {
      console.log(data);
      // Here you can also render data to script or do other operations
    }
  }, [data]); // This runs whenever data changes

  return (
    <>
      <div>
        <h1>Message from Backend</h1>
        
        <p>Status: {data?.status?.toString()}</p>
        <p>Message: {data?.message?.toString()}</p>
      </div>
    </>
  );
}
