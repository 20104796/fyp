const title = "element backend management"

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${title} - ${pageTitle} `
    }
    return `${title}`
}
