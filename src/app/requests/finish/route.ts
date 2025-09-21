import { finishRequestApplication } from "@/app/lib/actions";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();

    if (!id) {
        return NextResponse.json({
            status: 'error',
            message: 'Missing id'
        });
    }
    const data = await finishRequestApplication(id);
    return redirect('/requests');
}
