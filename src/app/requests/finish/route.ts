import { finishBloodRequests } from "@/app/lib/actions";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    console.log(`Received id = ${id}`);

    if (!id) {
        return NextResponse.json({
            status: 'error',
            message: 'Missing id'
        });
    }
    const data = await finishBloodRequests(id);
    return redirect('/requests');
}
