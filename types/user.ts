export type user = {
    id: number,
    first_name: string,
    last_name: string,
    full_name: string,
    username: string,
    mobile_phone?: string
}

export const userToString = (user: user): string => {

    return user.full_name;
}