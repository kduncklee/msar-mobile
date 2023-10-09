
export const shouldBlockBack = (pathname: string): boolean => {

    switch (pathname) {
        case '/callout-list':
            return true
        default:
            return false;
    }
}