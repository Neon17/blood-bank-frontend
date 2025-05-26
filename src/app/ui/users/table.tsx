// This UI component is used to print all users in table

import { User } from "@/app/lib/definitions"

// Import Users from table definitions

export default async function UsersTable({
    users,
}: {
   users: User[]
}){
    users?.map((user) => {
        return (
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
            </tr>
        )
    })
}