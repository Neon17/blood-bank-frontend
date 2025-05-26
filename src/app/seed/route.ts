export async function seedUsers () {
    // seed by fetching
}

export async function GET () {
    try {
        // call seed function
    }
    catch (error) {
        // Rollback seed
        return Response.json({ error: error }, { status: 500 });
    }
}