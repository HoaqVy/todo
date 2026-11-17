
export const getTodayStart = () => {
    const today = new Date();

    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
};

export const parseDateOnly = (dateValue) => {
    if (!dateValue) return null;

    // YYYY-MM-DD
    if (
        typeof dateValue === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ) {
        const [year, month, day] = dateValue
            .split("-")
            .map(Number);

        return new Date(year, month - 1, day);
    }

    return new Date(dateValue);
};

export const isToday = (dueDate) => {
    const date = parseDateOnly(dueDate);

    if (!date || Number.isNaN(date.getTime())) {
        return false;
    }

    const today = getTodayStart();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};

export const isUpcoming = (dueDate) => {
    const date = parseDateOnly(dueDate);

    if (!date || Number.isNaN(date.getTime())) {
        return false;
    }

    const today = getTodayStart();

    date.setHours(0, 0, 0, 0);

    return date > today;
};

export const isOverdue = (task) => {
    if (!task.dueDate) return false;
    if (task.status === "Completed") return false;

    const date = parseDateOnly(task.dueDate);

    if (!date || Number.isNaN(date.getTime())) {
        return false;
    }

    const today = getTodayStart();

    date.setHours(0, 0, 0, 0);

    return date < today;
};

export const formatDate = (dateValue) => {
    const date = parseDateOnly(dateValue);

    if (!date || Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export const toInputDate = (dateValue) => {
    const date = parseDateOnly(dateValue)

    if (!date || Number.isNaN(date.getTime())) {
        return ""
    }

    const year = date.getFullYear()
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0")

    const day = String(
        date.getDate()
    ).padStart(2, "0")

    return `${year}-${month}-${day}`
}