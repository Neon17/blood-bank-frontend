"use server"

//data fetching is done here
//like fetching data from an user

export async function fetchProfile(){
    try {
        const data = await fetch("http://localhost:3000/backend/profile");
        return data.json();
    } catch (error) {
        console.log(error); 
    }
}

export async function test(){
    // const url = new URL('/backend/test', process.env.NEXT_PUBLIC_API_URL);
    try {
        const data = await fetch('http://localhost:3000/backend/test');
        const result = await data.json();
        return result;
    } catch (error) {
        console.log(error);
    }
}   