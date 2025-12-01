export const formatTimeAgo = (dateString: string): string => {
    if (!dateString || dateString === "Never" || dateString === "Unknown") {
        return dateString || "Unknown";
    }

    try {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months}mo ago`;
        const years = Math.floor(days / 365);
        return `${years}y ago`;
    } catch (e) {
        return "Unknown";
    }
};

export const formatDateTime = (dateString: string): string => {
    if (!dateString || dateString === "Never" || dateString === "Unknown") {
        return dateString || "Unknown";
    }

    try {
        const date = new Date(dateString);

        // Format as DD.MM.YYYY HH:mm
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch (e) {
        return "Invalid date";
    }
};
