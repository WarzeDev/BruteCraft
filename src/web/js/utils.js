export async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function timeDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}