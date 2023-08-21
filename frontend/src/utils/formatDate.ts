export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString("vi-VN",
    {
        year: "numeric",
        month:"short",
        day:"numeric",
        hour: "numeric",
        minute : "numeric",
    });
}