import "../storage/global";

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

export const isUserSelf = (user: user): boolean => {

    if (global.currentCredentials) {
        //console.log(global.currentCredentials);
        if (global.currentCredentials.username) {
            if (global.currentCredentials.username === user.username) {
                return true;
            }
        }
    }

    return false;
}