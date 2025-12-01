import { formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatTimeAgo = (dateString: string | undefined | null): string => {
    if (!dateString || dateString === 'Never' || dateString === 'Unknown') {
        return 'Unknown';
    }

    try {
        const date = parseISO(dateString);
        if (!isValid(date)) {
            return dateString; // Return original if invalid
        }
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
        return dateString;
    }
};
